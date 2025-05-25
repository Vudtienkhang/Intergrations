import React, {useState, useEffect, useContext} from 'react';
import styles from './styles.module.scss';
import axios from 'axios';
import {IoIosAdd} from 'react-icons/io';
import {ToastContext} from '../../Contexts/ToastProvider';
import StatusToggle from '../StatusToggle/StatusToggle';
import AddAccount from '../AddAccount/AddAccount';
import {AnimatePresence, motion} from 'framer-motion';

function Account() {
  const [accountData, setAccountData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const {toast} = useContext(ToastContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/getAccount');
      if (res.data && res.data.length > 0) {
        setAccountData(res.data);
      } else {
        setAccountData([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tài khoản:', error);
      toast.error('Lỗi khi tải thông tin tài khoản');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accountData) {
      const filtered = accountData.filter((acc) => acc.FullName.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredAccounts(filtered);
    }
  }, [searchTerm, accountData]);

  const handleToggleStatus = async (username) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/toggleAccountStatus`, {UserName: username});
      if (res.status === 200) {
        toast.success('Cập nhật trạng thái thành công!');
        fetchAccounts();
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
      console.error(error);
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
          <div className={styles.containerTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Tên đăng nhập</th>
                  <th>Mật khẩu</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc) => (
                  <tr key={acc.UserName}>
                    <td>{acc.FullName}</td>
                    <td>{acc.UserName}</td>
                    <td>{'*'.repeat(acc.Password.length)}</td>
                    <td>{acc.RoleName}</td>
                    <td>
                      <StatusToggle isActive={acc.Status === 'active'} onToggle={() => handleToggleStatus(acc.UserName)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Đang tải thông tin tài khoản...</p>
      )}

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div className={styles.overlay} initial={{opacity: 0}} animate={{opacity: 0.5}} exit={{opacity: 0}} transition={{duration: 0.3}} />
            <motion.div initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}} transition={{duration: 0.3}} className={styles.modalWrapper}>
              <AddAccount onClose={() => setShowForm(false)} onSave={fetchAccounts} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Account;
