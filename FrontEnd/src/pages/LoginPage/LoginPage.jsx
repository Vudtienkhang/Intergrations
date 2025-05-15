import Button from '../../components/Button/Button';
import styles from './styles.module.scss';
import {useContext, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {ToastContext} from '../../Contexts/ToastProvider';

function LoginPage() {
  const {loginContainer, btnLogin, loginForm, title, subtitle, input, formGroup, label, forgotPassword, loginInfo, description} = styles;

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {toast} = useContext(ToastContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/login', {
        username: userName,
        password,
      });

      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Đăng nhập thành công!');

      navigate('/dashboardadmin');
    } catch (error) {
      const msg = error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập.';
      toast.error(msg);
    }
  };

  return (
    <div className={loginContainer}>
      <div className={loginForm}>
        <h1 className={title}>Hệ thống Quản lý Nhân sự</h1>
        <p className={subtitle}>Đăng nhập vào tài khoản</p>
        <form onSubmit={handleLogin}>
          <div className={formGroup}>
            <label htmlFor="userName" className={label}>
              Tên đăng nhập
            </label>
            <input type="text" id="userName" placeholder="Tên đăng nhập" className={input} value={userName} onChange={(e) => setUserName(e.target.value)} required />
          </div>
          <div className={formGroup}>
            <label htmlFor="password" className={label}>
              Mật khẩu
            </label>
            <input type="password" id="password" placeholder="Password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <a href="#" className={forgotPassword}>
            Quên mật khẩu?
          </a>
          <Button name="Đăng nhập" className={btnLogin} type="submit" />
        </form>
      </div>
      <div className={loginInfo}>
        <h1 className={title}>Hệ thống Quản lý Nhân sự</h1>
        <p className={description}>Tối ưu hóa quy trình nhân sự, hệ thống quản lý toàn diện</p>
      </div>
    </div>
  );
}

export default LoginPage;
