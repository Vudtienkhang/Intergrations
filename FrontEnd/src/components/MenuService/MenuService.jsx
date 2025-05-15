import styles from './styles.module.scss';
import {menuData, logoutItem} from './menuData.jsx';
import {useNavigate} from 'react-router-dom';

function MenuService({onMenuClick, activeMenu}) {
  const {sidebar, title, menuList, menuItem, active, icon, logout} = styles;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user ? user.role : null;

  const filteredMenuData = menuData.filter((item) => {
    if (userRole === 1) {
      return ![ ].includes(item.label);
      
    }

    if (userRole === 2) {
      return !['Lương & Chấm công', 'Phòng ban', 'Chức danh','Tài khoản'].includes(item.label);
    }

    if (userRole === 3) {
      return !['Nhân viên', 'Phòng ban', 'Chức danh', 'Tài khoản'].includes(item.label);
    }

    if (userRole === 4) {
      return !['Nhân viên', 'Lương & Chấm công', 'Phòng ban', 'Chức danh', 'Tài khoản'].includes(item.label);
    }

    return true;
  });

  const handleItemClick = (menuLabel) => {
    onMenuClick(menuLabel);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={sidebar}>
      <h2 className={title}>HR Dashboard</h2>
      <ul className={menuList}>
        {filteredMenuData.map((item) => (
          <li key={item.id} className={`${menuItem} ${item.label === activeMenu ? active : ''}`} onClick={() => handleItemClick(item.label)}>
            <span className={icon}>{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className={logout} onClick={handleLogout}>
        <span className={icon}>{logoutItem.icon}</span>
        <span>{logoutItem.label}</span>
      </div>
    </div>
  );
}

export default MenuService;
