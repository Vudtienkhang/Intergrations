import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import {ToastContext} from '../../Contexts/ToastProvider';

function PersonalAccount() {
  const user = JSON.parse(localStorage.getItem('user'));
  const employeeId = user?.id;
  const {toast} = useContext(ToastContext);

  const [employee, setEmployee] = useState({
    FullName: '',
    Gender: '',
    DateOfBirth: '',
    PhoneNumber: '',
    Email: '',
    Img_url: '',
    DepartmentName: '',
    PositionName: '',
    HireDate: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) {
      toast.error('Không tìm thấy ID người dùng.');
      return;
    }

    axios
      .get(`/api/getemployees/${employeeId}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setEmployee({
          FullName: data.FullName ?? '',
          Gender: data.Gender ?? '',
          DateOfBirth: data.DateOfBirth?.slice(0, 10) ?? '',
          PhoneNumber: data.PhoneNumber ?? '',
          Email: data.Email ?? '',
          Img_url: data.Img_url ?? '',
          DepartmentName: data.DepartmentName ?? '',
          PositionName: data.PositionName ?? '',
          HireDate: data.HireDate?.slice(0, 10) ?? '',
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error('Lỗi khi lấy thông tin cá nhân.');
        setLoading(false);
      });
  }, [employeeId, toast]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
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
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedData = {
      FullName: employee.FullName,
      Gender: employee.Gender,
      DateOfBirth: employee.DateOfBirth,
      PhoneNumber: employee.PhoneNumber,
      Email: employee.Email,
      Img_url: employee.Img_url,
    };

    try {
      console.log('Dữ liệu gửi lên:', updatedData);

      await axios.put(`/api/updateMyProfile/${employeeId}`, updatedData);
      toast.success('Cập nhật thành công');
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
      toast.error('Cập nhật thất bại');
    }
  };

  if (loading) return <p>Đang tải thông tin...</p>;

  return (
    <div className={styles.personalAccount}>
      <h2>Thông tin cá nhân</h2>
      <form className={styles.form} onSubmit={handleSave}>
        <label>
          Ảnh đại diện:
          <div className={styles.imageWrapper}>
            <img src={employee.Img_url || '/default-avatar.png'} alt="Ảnh nhân viên" className={styles.avatar} />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </label>

        <div className={styles.infoGrid}>
          <label>
            Họ tên:
            <input type="text" name="FullName" value={employee.FullName} onChange={handleChange} />
          </label>

          <label>
            Giới tính:
            <select name="Gender" value={employee.Gender} onChange={handleChange}>
              <option value="">--Chọn giới tính--</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </label>

          <label>
            Ngày sinh:
            <input type="date" name="DateOfBirth" value={employee.DateOfBirth} onChange={handleChange} />
          </label>

          <label>
            SĐT:
            <input type="text" name="PhoneNumber" value={employee.PhoneNumber} onChange={handleChange} />
          </label>

          <label>
            Email:
            <input type="email" name="Email" value={employee.Email} onChange={handleChange} />
          </label>

          <label>
            Ngày vào làm:
            <input type="date" value={employee.HireDate} disabled />
          </label>

          <label>
            Phòng ban:
            <input type="text" value={employee.DepartmentName} disabled />
          </label>

          <label>
            Chức vụ:
            <input type="text" value={employee.PositionName} disabled />
          </label>
        </div>

        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
}

export default PersonalAccount;
