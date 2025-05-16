import { useEffect, useState } from 'react';
import axios from 'axios';
import TableTimeKeepingByID from '../TableTimeKeepingByID/TableTimeKeepingByID';
import TimekeepingChart from '../TimeKeepingChart/TimeKeepingChart';
import SalaryChart from '../SalaryChart/SalaryChart';
import styles from './styles.module.scss';

function Timekeeping() {
  const [status, setStatus] = useState('Chưa chấm công');
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [timekeepingData, setTimekeepingData] = useState([]);
  const employeeId = JSON.parse(localStorage.getItem('user'))?.id;

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchTimekeepingData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/getTimekeepingByEmployee/${employeeId}`);
      setTimekeepingData(res.data);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu chấm công:', error);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchTimekeepingData();
    }
  }, [employeeId]);

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

      await fetchTimekeepingData();

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

          <TableTimeKeepingByID data={timekeepingData} />
        </div>
        <div className={styles.timekeepingChart}>

          <TimekeepingChart data={timekeepingData} />
        </div>
      </div>
      <div className={styles.salaryChart}>
        <SalaryChart data={timekeepingData} />
      </div>
    </div>
  );
}

export default Timekeeping;
