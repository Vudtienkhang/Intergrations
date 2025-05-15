import React, {useState, useEffect, useContext} from 'react';
import {ToastContext} from '../../Contexts/ToastProvider';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import {IoMdClose} from 'react-icons/io';
function AddUser({onClose}) {
  const {add_user_container,input_infor ,iconClose, add_user_left, add_user_title, add_user_form, add_user_label, add_user_input, btn_submit} = styles;
  const {toast} = useContext(ToastContext);
  const [userData, setUserData] = useState({
    HoTen: '',
    NgaySinh: '',
    GioiTinh: '',
    SoDienThoai: '',
    Email: '',
    NgayVaoLam: '',
    ImgUrl: '',
    ChucVu: '',
    PhongBan: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chucVuList, setChucVuList] = useState([]);
  const [phongBanList, setPhongBanList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const phongBanResponse = await fetch('/api/departments');
        const chucVuResponse = await fetch('/api/positions');

        if (!chucVuResponse.ok || !phongBanResponse.ok) {
          throw new Error('Có lỗi khi lấy dữ liệu');
        }

        const phongBanData = await phongBanResponse.json();
        const chucVuData = await chucVuResponse.json();

        setPhongBanList(phongBanData);
        setChucVuList(chucVuData);
      } catch {
        toast.error('Không thể tải dữ liệu chức vụ hoặc phòng ban.');
      }
    };

    fetchData();
  }, [toast]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          ImgUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['HoTen', 'NgaySinh', 'GioiTinh', 'SoDienThoai', 'Email', 'NgayVaoLam', 'ChucVu', 'PhongBan'];
    for (let field of requiredFields) {
      if (!userData[field]) {
        toast.error(`Vui lòng điền thông tin ${field}`);
        return;
      }
    }

    const chucVuSelected = chucVuList.find((item) => item.PositionName === userData.ChucVu);
    const phongBanSelected = phongBanList.find((item) => item.DepartmentName === userData.PhongBan);

    if (!chucVuSelected || !phongBanSelected) {
      toast.error('Vui lòng chọn chức vụ và phòng ban hợp lệ!');
      return;
    }

    const mappedUserData = {
      FullName: userData.HoTen,
      Gender: userData.GioiTinh,
      DateOfBirth: userData.NgaySinh,
      PhoneNumber: userData.SoDienThoai,
      Email: userData.Email,
      HireDate: userData.NgayVaoLam,
      Img_url: userData.ImgUrl,
      PositionID: chucVuSelected.PositionID,
      DepartmentID: phongBanSelected.DepartmentID,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedUserData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Thêm người dùng thành công!');
        setUserData({
          HoTen: '',
          NgaySinh: '',
          GioiTinh: '',
          SoDienThoai: '',
          Email: '',
          NgayVaoLam: '',
          ImgUrl: '',
          ChucVu: '',
          PhongBan: '',
        });
        if (response.ok) {
          onClose();
        }
      } else {
        toast.error(data.message || 'Đã có lỗi xảy ra!');
      }
    } catch (err) {
      console.error('Có lỗi xảy ra:', err);
      toast.error('Có lỗi xảy ra khi gửi dữ liệu!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={add_user_container}>
      <div className={add_user_left}>
        <h2 className={add_user_title}>Thêm người dùng</h2>
        <div className={iconClose} onClick={onClose}>
          <IoMdClose size={'24px'} />
        </div>
        <form className={add_user_form} onSubmit={handleSubmit}>
          <div className={input_infor}>
            <div className="form_group">
              <label className={add_user_label}>Họ tên:</label>
              <input className={add_user_input} type="text" name="HoTen" value={userData.HoTen} onChange={handleChange} required />
            </div>

            <div className="form_group">
              <label className={add_user_label}>Ngày sinh:</label>
              <input className={add_user_input} type="date" name="NgaySinh" value={userData.NgaySinh} onChange={handleChange} required />
            </div>

            <div className="form_group">
              <label className={add_user_label}>Giới tính:</label>
              <input className={add_user_input} type="text" name="GioiTinh" value={userData.GioiTinh} onChange={handleChange} required />
            </div>

            <div className="form_group">
              <label className={add_user_label}>Số điện thoại:</label>
              <input className={add_user_input} type="text" name="SoDienThoai" value={userData.SoDienThoai} onChange={handleChange} required />
            </div>

            <div className="form_group">
              <label className={add_user_label}>Email:</label>
              <input className={add_user_input} type="email" name="Email" value={userData.Email} onChange={handleChange} required />
            </div>

            <div className="form_group">
              <label className={add_user_label}>Ngày vào làm:</label>
              <input className={add_user_input} type="date" name="NgayVaoLam" value={userData.NgayVaoLam} onChange={handleChange} required />
            </div>

            <div className="form_group">
              <label className={add_user_label}>Chức vụ:</label>
              <select className={add_user_input} name="ChucVu" value={userData.ChucVu} onChange={handleChange} required>
                <option value="">Chọn chức vụ</option>
                {chucVuList.map((item) => (
                  <option key={item.PositionID} value={item.PositionName}>
                    {item.PositionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form_group">
              <label className={add_user_label}>Phòng ban:</label>
              <select className={add_user_input} name="PhongBan" value={userData.PhongBan} onChange={handleChange} required>
                <option value="">Chọn phòng ban</option>
                {phongBanList.map((item) => (
                  <option key={item.DepartmentID} value={item.DepartmentName}>
                    {item.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form_group">
            <label className={add_user_label}>Ảnh đại diện:</label>
            <input className={add_user_input} type="file" name="ImgUrl" onChange={handleFileChange} />
            {userData.ImgUrl && <img src={userData.ImgUrl} alt="Ảnh đại diện" style={{width: 100, height: 100, objectFit: 'cover'}} />}
          </div>
          <Button name={isSubmitting ? 'Đang thêm...' : 'THÊM'} disabled={isSubmitting} className={btn_submit}/>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
