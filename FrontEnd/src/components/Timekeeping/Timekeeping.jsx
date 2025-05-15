import styles from './styles.module.scss';
import axios from 'axios';
import {useState} from 'react';
import TableTimeKeepingByID from '../TableTimeKeepingByID/TableTimeKeepingByID';
import TimekeepingChart from '../TimeKeepingChart/TimeKeepingChart';
import SalaryChart from '../SalaryChart/SalaryChart';

function Timekeeping() {
  const [status, setStatus] = useState('Chưa chấm công');
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const employeeId = JSON.parse(localStorage.getItem('user'))?.id;

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleTimekeeping = async (type) => {
    if (!employeeId) {
      setStatus('Chưa đăng nhập!');
      return;
    }
    const today = getCurrentDate();

    try {
      const res = await axios.post('http://localhost:3000/api/addTimekeeping', {
        employeeID: employeeId,
        type: type,
        date: today,
      });
      setStatus(res.data.message);
      setButtonsVisible(false);
    } catch (err) {
      if (err.response && err.response.data?.message === 'Đã chấm công hôm nay!') {
        setStatus('Bạn đã chấm công hôm nay rồi!');
        setButtonsVisible(false);
      } else {
        console.error('Lỗi chấm công:', err);
        setStatus('Chấm công thất bại!');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chấm công</h1>
      <p className={styles.status}>Trạng thái hiện tại: {status}</p>
      {buttonsVisible && (
        <div className={styles.buttonGroup}>
          <button className={styles.checkInButton} onClick={() => handleTimekeeping('work')}>
            Chấm công
          </button>
          <button className={styles.leaveButton} onClick={() => handleTimekeeping('leave')}>
            Nghỉ phép
          </button>
          <button className={styles.absentButton} onClick={() => handleTimekeeping('absent')}>
            Nghỉ không phép
          </button>
        </div>
      )}
      <div className={styles.report}>
        <div className={styles.tableTimeKeeping}>
          <TableTimeKeepingByID />
        </div>
        <div className={styles.timekeepingChart}>
          <TimekeepingChart/>
        </div>
      </div>
      <div className={styles.salaryChart}>
        <SalaryChart />
      </div>
    </div>
  );
}

export default Timekeeping;
