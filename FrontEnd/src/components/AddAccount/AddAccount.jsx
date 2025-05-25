import React, { useState, useEffect, useContext } from 'react';
import styles from './styles.module.scss';
import axios from 'axios';
import { IoMdClose } from 'react-icons/io';
import { ToastContext } from '../../Contexts/ToastProvider';
import FaceRegister from '../FaceRegister/FaceRegister';

function AddAccount({ onClose, onSave }) {
  const { toast } = useContext(ToastContext);

  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState([]);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isFaceRegisterOpen, setIsFaceRegisterOpen] = useState(false);

  const [formData, setFormData] = useState({
    EmployeeID: '',
    UserName: '',
    RoleID: '',
    Password: '',
    ConfirmPassword: '',
  });

  useEffect(() => {
    fetch('/api/getEmployeeSalari')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.employees)) setEmployees(data.employees);
        else setEmployees([]);
      })
      .catch(() => setEmployees([]));
  }, []);

  useEffect(() => {
    fetch('/api/getRole')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRole(data);
        else setRole([]);
      });
  }, []);

  const handleAddAccount = async () => {
    if (!formData.EmployeeID || !formData.RoleID || !formData.UserName || !formData.Password || !formData.ConfirmPassword) {
      toast.error('Chưa đầy đủ thông tin');
      return;
    }
    if (formData.Password !== formData.ConfirmPassword) {
      toast.error('Hai mật khẩu không khớp');
      return;
    }

    const dataToSend = {
      ...formData,
      FaceDescriptor: faceDescriptor, 
    };

    try {
      const res = await axios.post('http://localhost:3000/api/addAccount', dataToSend);
      if (res.status === 200) {
        toast.success('Thêm tài khoản thành công!');
        onSave();
        onClose();
      } else {
        toast.error('Lỗi thêm tài khoản!');
      }
    } catch (error) {
      toast.error('Lỗi server khi thêm tài khoản');
      console.error(error);
    }
  };

  const handleFaceScan = () => {
    if (!formData.EmployeeID) {
      toast.error('Vui lòng chọn nhân viên trước khi quét khuôn mặt');
      return;
    }
    setIsFaceRegisterOpen(true);
  };

  return (
    <div className={styles.accountForm}>
      <div className={styles.formHeader}>
        <h3>Thêm tài khoản mới</h3>
        <IoMdClose size="24px" className={styles.closeIcon} onClick={onClose} />
      </div>

      <label>
        Nhân viên:
        <select value={formData.EmployeeID} onChange={(e) => setFormData({ ...formData, EmployeeID: e.target.value })}>
          <option value="">-- Chọn nhân viên --</option>
          {employees.map((emp) => (
            <option key={emp.EmployeeID} value={emp.EmployeeID}>
              {emp.FullName}
            </option>
          ))}
        </select>
      </label>

      <label>
        Tên đăng nhập
        <input type="text" value={formData.UserName} onChange={(e) => setFormData({ ...formData, UserName: e.target.value })} />
      </label>

      <label>
        Phân quyền:
        <select value={formData.RoleID} onChange={(e) => setFormData({ ...formData, RoleID: e.target.value })}>
          <option value="">-- Chọn phân quyền --</option>
          {role.map((r) => (
            <option key={r.RoleID} value={r.RoleID}>
              {r.RoleName}
            </option>
          ))}
        </select>
      </label>

      <label>
        Mật khẩu
        <input type="password" value={formData.Password} onChange={(e) => setFormData({ ...formData, Password: e.target.value })} />
      </label>

      <label>
        Nhập lại mật khẩu
        <input type="password" value={formData.ConfirmPassword} onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })} />
      </label>

      <div className={styles.buttonGroup}>
        <button onClick={handleAddAccount}>Lưu</button>
        <button type="button" onClick={handleFaceScan} className={styles.buttonFace}>Quét khuôn mặt (Tùy chọn)</button>
      </div>

      {isFaceRegisterOpen && (
        <FaceRegister
          employeeId={formData.EmployeeID}
          onRegisterSuccess={(descriptor) => {
            setFaceDescriptor(descriptor);
            setIsFaceRegisterOpen(false);
            toast.success('Đã lưu khuôn mặt thành công!');
          }}
          onCancel={() => setIsFaceRegisterOpen(false)}
        />
      )}
    </div>
  );
}

export default AddAccount;
