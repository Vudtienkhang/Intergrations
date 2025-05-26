import Button from '../../components/Button/Button';
import styles from './styles.module.scss';
import {useContext, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {ToastContext} from '../../Contexts/ToastProvider';
import FaceLogin from '../../components/LoginFace/LoginFace';


function LoginPage() {
  const {loginContainer, btnLogin, loginForm, title, subtitle, input, formGroup, label, forgotPassword, loginInfo, description} = styles;

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const [showFaceLogin, setShowFaceLogin] = useState(false);

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

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/sendVerificationCode', {email});
      toast.success('Mã xác nhận đã được gửi đến email');
      setStep(2);
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi khi gửi mã xác nhận.';
      toast.error(msg);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!verificationCode || !newPassword) {
      toast.error('Vui lòng nhập đầy đủ mã xác nhận và mật khẩu mới');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/resetPassword', {
        email,
        code: verificationCode,
        newPassword,
      });
      toast.success('Đặt lại mật khẩu thành công!');
      setIsForgotPassword(false);
      setStep(1);
      setEmail('');
      setVerificationCode('');
      setNewPassword('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi khi đặt lại mật khẩu.';
      toast.error(msg);
    }
  };

  const onFaceLoginSuccess = () => {
    toast.success('Đăng nhập bằng khuôn mặt thành công!');
    navigate('/dashboardadmin');
  };

  return (
    <div className={loginContainer}>
      <div className={loginForm}>
        <h1 className={title}>Hệ thống Quản lý Nhân sự</h1>

        {!showFaceLogin && (
          <>
            <p className={subtitle}>{isForgotPassword ? (step === 1 ? 'Nhập email để nhận mã xác nhận' : 'Nhập mã xác nhận và mật khẩu mới') : 'Đăng nhập vào tài khoản'}</p>

            <form onSubmit={isForgotPassword ? (step === 1 ? handleSendCode : handleResetPassword) : handleLogin}>
              {isForgotPassword ? (
                step === 1 ? (
                  <div className={formGroup}>
                    <label className={label}>Email</label>
                    <input type="email" placeholder="Email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                ) : (
                  <>
                    <div className={formGroup}>
                      <label className={label}>Mã xác nhận</label>
                      <input type="text" placeholder="Mã xác nhận" className={input} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                    </div>
                    <div className={formGroup}>
                      <label className={label}>Mật khẩu mới</label>
                      <input type="password" placeholder="Mật khẩu mới" className={input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                  </>
                )
              ) : (
                <>
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
                    <input type="password" id="password" placeholder="Mật khẩu" className={input} value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </>
              )}

              <button
                type="button"
                className={forgotPassword}
                onClick={() => {
                  setIsForgotPassword(!isForgotPassword);
                  setStep(1);
                  setEmail('');
                  setVerificationCode('');
                  setNewPassword('');
                }}
              >
                {isForgotPassword ? 'Quay lại đăng nhập' : 'Quên mật khẩu?'}
              </button>

              <Button name={isForgotPassword ? (step === 1 ? 'Gửi mã' : 'Xác nhận đổi mật khẩu') : 'Đăng nhập'} className={btnLogin} type="submit" />

              {!isForgotPassword && <Button name="Đăng nhập bằng khuôn mặt" className={btnLogin} type="button" onClick={() => setShowFaceLogin(true)} />}
            </form>
          </>
        )}

        {showFaceLogin && (
          <>
            <FaceLogin  onLoginSuccess={onFaceLoginSuccess} toast={toast} navigate={navigate}/>
            <Button name="Quay lại đăng nhập" className={btnLogin} type="button" onClick={() => setShowFaceLogin(false)} />
          </>
        )}
      </div>

      <div className={loginInfo}>
        <h1 className={title}>Hệ thống Quản lý Nhân sự</h1>
        <p className={description}>Tối ưu hóa quy trình nhân sự, hệ thống quản lý toàn diện</p>
      </div>
    </div>
  );
}

export default LoginPage;
