import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import {IoMdClose} from 'react-icons/io';
import {ToastContext} from '../../Contexts/ToastProvider';
function UpdateEmployees({EmployeeID, onClose, onUpdateSuccess}) {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const {toast} = useContext(ToastContext);
  const [employee, setEmployee] = useState({
    FullName: '',
    Gender: '',
    PhoneNumber: '',
    Email: '',
    HireDate: '',
    DateOfBirth: '',
    PositionID: '',
    DepartmentID: '',
    Status: '',
    Img_url: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/positions')
      .then((res) => setPositions(res.data))
      .catch((err) => console.error('Lỗi lấy positions:', err));

    axios
      .get('http://localhost:3000/api/departments')
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error('Lỗi lấy departments:', err));
  }, []);

  useEffect(() => {
    if (!EmployeeID || isNaN(parseInt(EmployeeID))) {
      console.error('EmployeeID không hợp lệ:', EmployeeID);
      return;
    }
    axios
      .get(`http://localhost:3000/api/getemployees/${EmployeeID}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data || {};
        setEmployee({
          FullName: data.FullName ?? '',
          Gender: data.Gender ?? '',
          PhoneNumber: data.PhoneNumber ?? '',
          Email: data.Email ?? '',
          HireDate: data.HireDate?.slice(0, 10) ?? '',
          DateOfBirth: data.DateOfBirth?.slice(0, 10) ?? '',
          PositionID: data.PositionID ?? '',
          DepartmentID: data.DepartmentID ?? '',
          Status: data.Status ?? '',
          Img_url: data.Img_url ?? '',
        });
      })
      .catch((err) => console.error('Lỗi lấy thông tin nhân viên:', err));
  }, [EmployeeID]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/api/employees/${EmployeeID}`, employee)
      .then(() => {
        toast.success('Cập nhật nhân viên thành công!');
        if (onClose) onUpdateSuccess();
        onClose();
      })
      .catch((err) => {
        console.error('Lỗi khi cập nhật:', err);
        toast.error('Lỗi cập nhật');
      });
  };

  return (
    <div className={styles.formContainer}>
      <h2>Cập nhật thông tin nhân viên</h2>
      <button className={styles.closeButton} onClick={onClose}>
        <IoMdClose size={'24px'} />
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ tên:</label>
          <input type="text" name="FullName" value={employee.FullName} onChange={handleChange} />
        </div>

        <div>
          <label>Giới tính:</label>
          <select name="Gender" value={employee.Gender} onChange={handleChange}>
            <option value="">--Chọn giới tính--</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div>
          <label>Số điện thoại:</label>
          <input type="text" name="PhoneNumber" value={employee.PhoneNumber} onChange={handleChange} />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="Email" value={employee.Email} onChange={handleChange} />
        </div>

        <div>
          <label>Ngày vào làm:</label>
          <input type="date" name="HireDate" value={employee.HireDate?.slice(0, 10)} onChange={handleChange} />
        </div>

        <div>
          <label>Ngày sinh:</label>
          <input type="date" name="DateOfBirth" value={employee.DateOfBirth?.slice(0, 10)} onChange={handleChange} />
        </div>

        <div>
          <label>Vị trí:</label>
          <select name="PositionID" value={employee.PositionID} onChange={handleChange}>
            <option value="">--Chọn vị trí--</option>
            {positions.map((pos) => (
              <option key={pos.PositionID} value={pos.PositionID}>
                {pos.PositionName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Phòng ban:</label>
          <select name="DepartmentID" value={employee.DepartmentID} onChange={handleChange}>
            <option value="">Chọn phòng ban</option>
            {departments.map((dep) => (
              <option key={dep.DepartmentID} value={dep.DepartmentID}>
                {dep.DepartmentName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Trạng thái:</label>
          <select name="Status" value={employee.Status} onChange={handleChange}>
            <option value="">--Chọn trạng thái--</option>
            <option value="Đang làm">Đang làm</option>
            <option value="Nghỉ phép">Nghỉ phép</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
          </select>
        </div>
        <div>
          <label>Ảnh đại diện (URL):</label>
          <img src={employee.Img_url} alt="" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setEmployee((prev) => ({
                    ...prev,
                    Img_url: reader.result,
                  }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <button type="submit">Lưu</button>
      </form>
    </div>
  );
}

export default UpdateEmployees;
