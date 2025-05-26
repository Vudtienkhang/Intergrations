import {useEffect, useState} from 'react';
import styles from './styles.module.scss';
import {FaRegUser} from 'react-icons/fa';
import {LuBellRing} from 'react-icons/lu';

function Header() {
  const {container, notification, bellIcon, badge, userInfo, avatar, userDetails, role, username, notificationList, notificationItem} = styles;
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const name = JSON.parse(localStorage.getItem('user'))?.username;
  useEffect(() => {
    fetch('http://localhost:3000/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications);
      })
      .catch((err) => console.error('Lỗi khi lấy thông báo:', err));
  }, []);

  const toggleNotifications = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className={container}>
      <div className={notification} onClick={toggleNotifications}>
        <span className={bellIcon}>
          <LuBellRing size={'24px'} />
        </span>
        {notifications.length > 0 && <span className={badge}>{notifications.length}</span>}
      </div>
      <div className={userInfo}>
        <span className={avatar}>
          <FaRegUser size={'24px'} />
        </span>
        <div className={userDetails}>
          <span className={role}>Xin chào!!!</span>
          <span className={username}>{name}</span>
        </div>
      </div>

      {isOpen && notifications.length > 0 ? (
        <div className={notificationList}>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} className={notificationItem}>
                <strong>{notification.message}</strong>
                vào ngày {new Date(notification.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      ) : isOpen ? (
        <div className={notificationList}>
          <p>Không có thông báo mới.</p>
        </div>
      ) : null}
    </div>
  );
}

export default Header;
