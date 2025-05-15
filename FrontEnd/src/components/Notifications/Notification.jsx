import {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import {CiCalendarDate, CiDollar} from 'react-icons/ci';
import {FaBirthdayCake} from 'react-icons/fa';
import Lottie from 'lottie-react';
import noDataAnim from '../../assets/lottie/no-data.json';
import { BiError } from "react-icons/bi";
function Notification() {
  const {iconPink, iconRed, iconYellow, container, header, loadings, noData, list, iconWrapper, content, type, message, date, item, iconErr} = styles;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/notifications');
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'Kỷ niệm':
        return <CiCalendarDate className={iconYellow} />;
      case 'Sinh nhật':
        return <FaBirthdayCake className={iconRed} size={'14px'} />;
      case 'Cảnh báo':
        return <BiError className={iconErr} size={'14px'} />;
      default:
        return <BiError className={iconPink} />;
    }
  };

  return (
    <div className={container}>
      <h2 className={header}>Recent Alerts</h2>
      {loading ? (
        <p className={loadings}>Đang tải...</p>
      ) : notifications.length === 0 ? (
        <div className={noData}>
          <Lottie animationData={noDataAnim} loop={true} style={{width: 300, height: 300}} />
        </div>
      ) : (
        <ul className={list}>
          {notifications.map((note, index) => (
            <li key={index} className={item}>
              <div className={iconWrapper}>{getIcon(note.type)}</div>
              <div className={content}>
                <h3 className={type}>{note.type}</h3>
                <p className={message}>{note.message}</p>
                <p className={date}>{new Date(note.date).toLocaleDateString('vi-VN')}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
