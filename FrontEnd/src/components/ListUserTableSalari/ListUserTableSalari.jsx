import React, {useState, useEffect, useContext} from 'react';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import { ToastContext } from '../../Contexts/ToastProvider';

function ListUserTableSalari() {
  const {container, message, table, tableHead, controls, searchInput,btn, btn_delete, salaryForm} = styles;

  const [data, setData] = useState([]);
  const {toast} = useContext(ToastContext)
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
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
        toast.success("Thêm lương thành công")
        setShowForm(false);
        setFormData({EmployeeID: '', BaseSalary: '', Bonus: '', Deductions: ''});
        setData((prevData) => [
          ...prevData,
          {
            EmployeeID: Number(EmployeeID),
            BaseSalary: Number(BaseSalary),
            Bonus: Number(Bonus),
            Deductions: Number(Deductions),
            NetSalary: Number(BaseSalary) + Number(Bonus) - Number(Deductions),
            SalaryMonth: new Date().toISOString().split('T')[0],
          },
        ]);
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
          alert('Xóa lương thành công');
          setData(data.filter((item) => item.SalaryID !== salaryID));
        })
        .catch((err) => {
          alert('Lỗi: ' + err.message);
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
        alert('Cập nhật thành công');
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
        alert('Lỗi: ' + err.message);
      });
  };

  if (loading) return <p className={message}>Đang tải dữ liệu...</p>;
  if (error) return <p className={message}>Lỗi: {error}</p>;

  const filteredData = data.filter((item) => item.FullName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={container}>
      <div className={controls}>
        <input type="text" placeholder="Tìm theo tên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={searchInput} />
        <Button name="Thêm" onClick={() => setShowForm(true)} className={btn}/>
      </div>

      <table className={table}>
        <thead className={tableHead}>
          <tr>
            <th>Mã nhân viên</th>
            <th>Họ tên</th>
            <th>Lương cơ bản</th>
            <th>Phụ cấp</th>
            <th>Thưởng</th>
            <th>Khấu trừ</th>
            <th>Lương thực nhận</th>
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
                <td>{item.LuongCoBan.toLocaleString()}</td>
                <td>{item.Thuong.toLocaleString()}</td>
                <td>{item.KhauTru.toLocaleString()}</td>
                <td>{item.LuongThucNhan.toLocaleString()}</td>
                <td>
                  <Button
                    name={'Cập Nhật'}
                    onClick={() => {
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
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingSalaryID && (
        <div className={salaryForm}>
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
          <Button name="Cập nhật" onClick={() => handleUpdateSalary(editingSalaryID)} className={btn} />
          <Button name="Hủy" onClick={() => setEditingSalaryID(null)} className={btn_delete} />
        </div>
      )}

      {showForm && (
        <div className={salaryForm}>
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
          <Button name="Lưu" onClick={handleAddSalary} className={btn} />
          <Button name="Hủy" onClick={() => setShowForm(false)} className={btn_delete} />
        </div>
      )}
    </div>
  );
}

export default ListUserTableSalari;
