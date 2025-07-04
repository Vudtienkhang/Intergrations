import React, {useContext, useEffect, useState, useRef} from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import moment from 'moment';
import styles from './styles.module.scss';
import UpdateEmployees from '../UpdateEmployees/UpdateEmployees';
import AddUser from '../AddUser/Adduser';
import {IoIosAdd} from 'react-icons/io';
import {MdOutlineSystemUpdateAlt, MdDeleteOutline} from 'react-icons/md';
import {ToastContext} from '../../Contexts/ToastProvider';
import {exportEmployeesToExcel} from '../../utils/exportExcel';
import {importEmployeesFromExcel} from '../../utils/importExcel';
import StatusToggle from '../StatusToggle/StatusToggle';
import ListCardEmployees from '../ListCardEmployees/ListCardEmployees';

function Table_Employees() {
  const [employees, setEmployees] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const fileInputRef = useRef(null);
  const [isCardView, setIsCardView] = useState(false);
  const {functions, infor, toggle, header, table, table_dark, tbImg, groupEmployee, nameBold, modal_backdrop, btn_add, btn, statusWorking, statusQuit, statusLeave, container_table, btn_import, btn_export, container_btn} = styles;

  const {toast} = useContext(ToastContext);
  const getStatusClass = (status) => {
    switch (status) {
      case 'Đang làm':
        return statusWorking;
      case 'Nghỉ việc':
        return statusQuit;
      case 'Nghỉ phép':
        return statusLeave;
      default:
        return '';
    }
  };

  const fetchEmployees = () => {
    axios
      .get('http://localhost:3000/api/employees')
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error('Lỗi lấy danh sách nhân viên:', err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = (EmployeeID) => {
    if (window.confirm('Bạn có muốn xoá chứ?')) {
      axios
        .delete(`http://localhost:3000/api/employees/${EmployeeID}`)
        .then(() => {
          toast.success('Xoá thành công!!');
          fetchEmployees();
        })
        .catch((err) => {
          console.error('Lỗi khi xóa nhân viên:', err);
          toast.error('Lỗi khi xoá!');
        });
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchName = emp.FullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPosition = selectedPosition ? emp.PositionName === selectedPosition : true;
    const matchDepartment = selectedDepartment ? emp.DepartmentName === selectedDepartment : true;
    return matchName && matchPosition && matchDepartment;
  });

  const uniquePositions = [...new Set(employees.map((emp) => emp.PositionName))];
  const uniqueDepartments = [...new Set(employees.map((emp) => emp.DepartmentName))];

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const employees = await importEmployeesFromExcel(file);

      const res = await axios.post('http://localhost:3000/api/import', employees);

      if (res.status == 200) {
        toast.success('Import thành công!');
        fetchEmployees();
      }
    } catch (err) {
      console.error('Lỗi import:', err);
      toast.error('Import thất bại!');
    }
  };
  return (
    <div className="container-fluid mt-3" style={{maxHeight: '850px', overflowY: 'auto'}}>
      <div className={functions}>
        <div className={header}>
          <div className={toggle}>
            <h1>Employees</h1>
            <StatusToggle isActive={isCardView} onToggle={() => setIsCardView(!isCardView)} />
          </div>
          <div className={container_btn}>
            <button className={btn_add} onClick={() => setShowAddUser(true)}>
              <IoIosAdd /> Thêm
            </button>
            <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} ref={fileInputRef} style={{display: 'none'}} />
            <button className={btn_import} onClick={() => fileInputRef.current.click()}>
              Nhập từ Excel
            </button>
            <button className={btn_export} onClick={() => exportEmployeesToExcel(employees)}>
              Xuất excel
            </button>
          </div>
        </div>

        <div className="row align-items-end mb-3 mt-4">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Tìm kiếm theo tên" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-control" value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
              <option value="">-- Lọc theo vị trí --</option>
              {uniquePositions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-control" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="">-- Lọc theo phòng ban --</option>
              {uniqueDepartments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setSearchTerm('');
                setSelectedPosition('');
                setSelectedDepartment('');
              }}
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>
      <div className={container_table}>
        {isCardView ? (
          <ListCardEmployees employees={filteredEmployees} />
        ) : (
          <table className={table}>
            <thead className={table_dark}>
              <tr>
                <th>Thông tin nhân viên</th>
                <th>Số điện thoại</th>
                <th>Ngày vào làm</th>
                <th>Ngày sinh nhật</th>
                <th>Vị trí</th>
                <th>Phòng ban</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.EmployeeID}>
                  <td className={groupEmployee}>
                    <Tippy content={<img src={emp.Img_url} alt={`Ảnh nhân viên ${emp.FullName}`} style={{width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px'}} />} placement="right" animation="scale" theme="light" interactive={true} delay={[200, 0]}>
                      <div className={groupEmployee}>
                        <img src={emp.Img_url} alt="" className={tbImg} />
                        <div className={infor}>
                          <span className={nameBold}>{emp.FullName}</span>
                          <div>{emp.Email}</div>
                          <div>ID: {emp.EmployeeID}</div>
                        </div>
                      </div>
                    </Tippy>
                  </td>
                  <td>{emp.PhoneNumber}</td>
                  <td>{moment(emp.HireDate).format('DD/MM/YYYY')}</td>
                  <td>{moment(emp.DateOfBirth).format('DD/MM/YYYY')}</td>
                  <td>{emp.PositionName}</td>
                  <td>{emp.DepartmentName}</td>
                  <td className={getStatusClass(emp.Status)}>{emp.Status}</td>
                  <td>
                    <button className={btn} onClick={() => setSelectedEmployeeID(emp.EmployeeID)}>
                      <MdOutlineSystemUpdateAlt size="24px" />
                    </button>
                    <button className={btn} onClick={() => handleDelete(emp.EmployeeID)}>
                      <MdDeleteOutline size="24px" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedEmployeeID && (
        <div className={modal_backdrop}>
          <UpdateEmployees EmployeeID={selectedEmployeeID} onClose={() => setSelectedEmployeeID(null)} onUpdateSuccess={fetchEmployees} />
        </div>
      )}

      {showAddUser && (
        <div className={modal_backdrop}>
          <AddUser
            onClose={() => {
              setShowAddUser(false);
              fetchEmployees();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Table_Employees;
