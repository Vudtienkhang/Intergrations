import React, {useState, useEffect} from 'react';
import styles from './styles.module.scss';
import axios from 'axios';
import {IoIosAdd} from 'react-icons/io';
import {IoMdClose} from 'react-icons/io';
import {MdBrowserUpdated} from 'react-icons/md';

function Account() {
  const [accountData, setAccountData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  const [formData, setFormData] = useState({
    EmployeeID: '',
    UserName: '',
    RoleID: '',
    Password: '',
    ConfirmPassword: '',
  });

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/getAccount');
        if (res.data && res.data.length > 0) {
          setAccountData(res.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tài khoản:', error);
      }
    };

    fetchAccountInfo();
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

  useEffect(() => {
    fetch('/api/getRole')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRole(data);
        } else {
          console.error('Dữ liệu không hợp lệ:', data);
          setRole([]);
        }
      });
  }, []);

  useEffect(() => {
    if (accountData) {
      const filtered = accountData.filter((acc) => acc.FullName.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredAccounts(filtered);
    }
  }, [searchTerm, accountData]);

  const handleAddAccount = async () => {
    if (!formData.EmployeeID || !formData.RoleID || !formData.UserName || !formData.Password || !formData.ConfirmPassword) {
      alert('Chưa đẩy đủ thông tin');
      return;
    }
    if (formData.Password !== formData.ConfirmPassword) {
      alert('Hai mật khẩu không khùng nhau');
    }

    try {
      const res = await axios.post('http://localhost:3000/api/addAccount', formData);
      if (res.data.success) {
        alert('Thêm tài khoản thành công!!');
        setShowForm(false);
        setFormData({
          EmployeeID: '',
          UserName: '',
          RoleID: '',
          Password: '',
          ConfirmPassword: '',
        });
        const fetch = await axios.get('http://localhost:3000/api/getAccount');
        setAccountData(fetch.data);
      } else {
        alert('Lỗi thêm tài khoản!');
      }
    } catch (error) {
      console.error('Lỗi khi thêm nhân viên!', error);
      alert('Lỗi Server');
    }
  };

  return (
    <div className={styles.accountContainer}>
      {accountData ? (
        <div className={styles.accountInfo}>
          <h1>Thông tin tài khoản</h1>
          <input type="text" placeholder="Tìm theo tên nhân viên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
          <button className={styles.btn_add} onClick={() => setShowForm(true)}>
            <IoIosAdd /> Thêm
          </button>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Tên đăng nhập</th>
                <th>Mật khẩu</th>
                <th>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr key={acc.UserName}>
                  <td>{acc.FullName}</td>
                  <td>{acc.UserName}</td>
                  <td>{'*'.repeat(acc.Password.length)}</td>
                  <td>{acc.RoleName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Đang tải thông tin tài khoản...</p>
      )}

      {showForm && (
        <div className={styles.accountForm}>
          <div className={styles.formHeader}>
            <h3>Thêm tài khoản mới</h3>
            <IoMdClose size="24px" className={styles.closeIcon} onClick={() => setShowForm(false)} />
          </div>
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
          <label>
            Tên đăng nhập
            <input type="text" value={formData.UserName} onChange={(e) => setFormData({...formData, UserName: e.target.value})} />
          </label>

          <label>
            Phân quyền:
            <select value={formData.RoleID} onChange={(e) => setFormData({...formData, RoleID: e.target.value})}>
              <option value="">-- Chọn phân quyền --</option>
              {role.map((emp) => (
                <option key={emp.RoleID} value={emp.RoleID}>
                  {emp.RoleName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Mật khẩu
            <input type="password" value={formData.Password} onChange={(e) => setFormData({...formData, Password: e.target.value})} />
          </label>
          <label>
            Nhập lại mật khẩu
            <input type="password" value={formData.ConfirmPassword} onChange={(e) => setFormData({...formData, ConfirmPassword: e.target.value})} />
          </label>
          <div className={styles.buttonGroup}>
            <button onClick={handleAddAccount}>Lưu</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
