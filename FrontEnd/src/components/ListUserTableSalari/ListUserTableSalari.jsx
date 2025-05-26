import React, {useState, useEffect, useContext} from 'react';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import {ToastContext} from '../../Contexts/ToastProvider';
import axios from 'axios';
import {IoCloseOutline} from 'react-icons/io5';
function ListUserTableSalari() {
  const {container, message, table, tableHead, controls, searchInput, btn, btnLuu,btn_delete, salaryForm, box_btn, overlay, closeIcon} = styles;

  const [data, setData] = useState([]);
  const {toast} = useContext(ToastContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const [formData, setFormData] = useState({
    EmployeeID: '',
    BaseSalary: '',
    Bonus: '',
    Deductions: '',
  });
  const [editingSalaryID, setEditingSalaryID] = useState(null);
  const [editFormData, setEditFormData] = useState({
    BaseSalary: '',
    Bonus: '',
    Deductions: '',
  });

  const fetchData = async () => {
    const res = await fetch('/api/getsalaries');
    const data = await res.json();
    setData(data);
  };

  useEffect(() => {
    fetch('/api/getsalaries')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Lỗi ${response.status}: Không thể lấy dữ liệu từ server`);
        }
        return response.json();
      })
      .then((data) => {
        const processedData = data.map((item) => ({
          ...item,
          SalaryID: item.SalaryID,
          LuongCoBan: parseFloat(item.BaseSalary || 0),
          Thuong: parseFloat(item.Bonus || 0),
          KhauTru: parseFloat(item.Deductions || 0),
          LuongThucNhan: parseFloat(item.NetSalary || 0),
          SalaryMonth: new Date(item.SalaryMonth),
          CreatedAt: new Date(item.CreatedAt),
        }));
        setData(processedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/getEmployeeSalari')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.employees)) {
          setEmployees(data.employees);
        } else {
          console.error('Dữ liệu không hợp lệ:', data);
          setEmployees([]);
        }
      })

      .catch((err) => {
        console.error('Lỗi khi fetch nhân viên:', err);
        setEmployees([]);
      });
  }, []);
  const handleAddSalary = () => {
    const {EmployeeID, BaseSalary, Bonus, Deductions} = formData;

    const netSalary = Number(BaseSalary) + Number(Bonus) - Number(Deductions);
    const salaryMonth = new Date().toISOString().split('T')[0];

    const payload = {
      EmployeeID: Number(EmployeeID),
      BaseSalary: Number(BaseSalary),
      Bonus: Number(Bonus),
      Deductions: Number(Deductions),
      NetSalary: netSalary,
      SalaryMonth: salaryMonth,
    };
    fetch('/api/addsalary', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Thêm lương thất bại');
        return res.json();
      })
      .then(() => {
        toast.success('Thêm lương thành công');
        setShowForm(false);
        setFormData({EmployeeID: '', BaseSalary: '', Bonus: '', Deductions: ''});
        fetchData();
      })

      .catch((err) => {
        alert('Lỗi: ' + err.message);
      });
  };

  const handleDeleteSalary = (salaryID) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
      fetch(`/api/deletesalary/${salaryID}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Xóa lương thất bại');
          return res.json();
        })
        .then(() => {
          toast.success('Xoá lương thành công!');
          setData(data.filter((item) => item.SalaryID !== salaryID));
        })
        .catch((err) => {
          toast.error('Lỗi:', err.message);
        });
    }
  };

  const handleUpdateSalary = (salaryID) => {
    const {BaseSalary, Bonus, Deductions} = editFormData;
    const NetSalary = Number(BaseSalary) + Number(Bonus) - Number(Deductions);

    const updatedSalary = {
      BaseSalary: Number(BaseSalary),
      Bonus: Number(Bonus),
      Deductions: Number(Deductions),
      NetSalary,
    };

    fetch(`/api/updatesalary/${salaryID}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updatedSalary),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Cập nhật thất bại');
        return res.json();
      })
      .then(() => {
        toast.success('Cập nhật lương thành công!');
        setEditingSalaryID(null);
        setData((prevData) =>
          prevData.map((item) =>
            item.SalaryID === salaryID
              ? {
                  ...item,
                  LuongCoBan: Number(BaseSalary),
                  Thuong: Number(Bonus),
                  KhauTru: Number(Deductions),
                  LuongThucNhan: NetSalary,
                }
              : item
          )
        );
      })
      .catch((err) => {
        toast.error('Lỗi:', err.message);
      });
  };

  if (loading) return <p className={message}>Đang tải dữ liệu...</p>;
  if (error) return <p className={message}>Lỗi: {error}</p>;

  const filteredData = data.filter((item) => {
    const fullNameMatch = item.FullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const salaryDate = new Date(item.SalaryMonth);
    if (isNaN(salaryDate.getTime())) {
      console.warn('Invalid SalaryMonth:', item.SalaryMonth);
      return false;
    }

    const month = salaryDate.getMonth() + 1;
    const year = salaryDate.getFullYear();
    const monthMatch = !filterMonth || String(month).padStart(2, '0') === filterMonth;
    const yearMatch = !filterYear || String(year) === filterYear;

    return fullNameMatch && monthMatch && yearMatch;
  });

  const handleSendPayrollEmail = async (salary) => {
    try {
      const payload = {
        EmployeeID: salary.EmployeeID,
        SalaryID: salary.SalaryID,
        BaseSalary: salary.BaseSalary,
        Bonus: salary.Bonus,
        Deductions: salary.Deductions,
        NetSalary: salary.NetSalary,
        SalaryMonth: new Date(salary.SalaryMonth).toISOString().slice(0, 10),
      };

      console.log('Dữ liệu', payload);

      const response = await axios.post('/api/sendPayroll', payload);

      if (response.status === 200) {
        toast.success('Gửi email lương thành công!');
      } else {
        toast.error('Gửi email thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi gửi email: ' + (error.response?.data?.message || error.message));
      console.log('lỗi', error);
    }
  };

  return (
    <div className={container}>
      <div className={controls}>
        <input type="text" placeholder="Tìm theo tên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={searchInput} />
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">Tất cả tháng</option>
          {[...Array(12)].map((_, i) => {
            const m = String(i + 1).padStart(2, '0');
            return (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            );
          })}
        </select>

        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">Tất cả năm</option>
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        <Button name="Thêm" onClick={() => setShowForm(true)} className={btn} />
      </div>

      <div className={styles.tableWrapper}>
        <table className={table}>
          <thead className={tableHead}>
            <tr>
              <th>Mã nhân viên</th>
              <th>Họ tên</th>
              <th>Tháng</th>
              <th>Lương cơ bản</th>
              <th>Thưởng</th>
              <th>Khấu trừ</th>
              <th>Lương thực nhận</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="9">Không có dữ liệu</td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.SalaryID}>
                  <td>{item.EmployeeID}</td>
                  <td>{item.FullName}</td>
                  <td>
                    {(() => {
                      const date = new Date(item.SalaryMonth);
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const year = date.getFullYear();
                      return `${month}/${year}`;
                    })()}
                  </td>
                  <td>{item.LuongCoBan?.toLocaleString?.() || '0'}</td>
                  <td>{item.Thuong?.toLocaleString?.() || '0'}</td>
                  <td>{item.KhauTru?.toLocaleString?.() || '0'}</td>
                  <td>{item.LuongThucNhan?.toLocaleString?.() || '0'}</td>
                  <td>
                    <Button
                      name={'Cập Nhật'}
                      onClick={() => {
                        if (item.SalaryID === undefined) {
                          console.error('SalaryID is undefined!', item);
                        }
                        setEditingSalaryID(item.SalaryID);
                        setEditFormData({
                          BaseSalary: item.LuongCoBan,
                          Bonus: item.Thuong,
                          Deductions: item.KhauTru,
                        });
                      }}
                    />
                  </td>
                  <td>
                    <Button name={'Xóa'} className={btn_delete} onClick={() => handleDeleteSalary(item.SalaryID)} />
                  </td>
                  <td>
                    <Button name={'Gửi email!'} onClick={() => handleSendPayrollEmail(item)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingSalaryID && (
        <div className={overlay}>
          <div className={salaryForm}>
            <div className={closeIcon} onClick={() => setEditingSalaryID(null)}>
              <IoCloseOutline size={'24px'} />
            </div>
            <h3>Cập nhật lương</h3>
            <label>
              Lương cơ bản:
              <input type="number" value={editFormData.BaseSalary} onChange={(e) => setEditFormData({...editFormData, BaseSalary: e.target.value})} />
            </label>
            <br />
            <label>
              Thưởng:
              <input type="number" value={editFormData.Bonus} onChange={(e) => setEditFormData({...editFormData, Bonus: e.target.value})} />
            </label>
            <br />
            <label>
              Khấu trừ:
              <input type="number" value={editFormData.Deductions} onChange={(e) => setEditFormData({...editFormData, Deductions: e.target.value})} />
            </label>
            <br />
            <div className={box_btn}>
              <Button name="Cập nhật" onClick={() => handleUpdateSalary(editingSalaryID)} className={btnLuu} />
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className={overlay}>
          <div className={salaryForm}>
            <div className={closeIcon} onClick={() => setShowForm(false)}>
              <IoCloseOutline size={'24px'} />
            </div>
            <h3>Thêm lương mới</h3>
            <label>
              Nhân viên:
              <select value={formData.EmployeeID} onChange={(e) => setFormData({...formData, EmployeeID: e.target.value})}>
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((emp) => (
                  <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.FullName}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Lương cơ bản:
              <input type="number" value={formData.BaseSalary} onChange={(e) => setFormData({...formData, BaseSalary: e.target.value})} />
            </label>
            <br />
            <label>
              Thưởng:
              <input type="number" value={formData.Bonus} onChange={(e) => setFormData({...formData, Bonus: e.target.value})} />
            </label>
            <br />
            <label>
              Khấu trừ:
              <input type="number" value={formData.Deductions} onChange={(e) => setFormData({...formData, Deductions: e.target.value})} />
            </label>
            <br />
            <div className={box_btn}>
              <Button name="Lưu" onClick={handleAddSalary} className={btnLuu} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListUserTableSalari;
