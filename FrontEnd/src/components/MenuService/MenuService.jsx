import { NavLink, useNavigate } from 'react-router-dom';
import { GoHome } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { SiGoogleclassroom } from "react-icons/si";
import { GiPositionMarker } from "react-icons/gi";
import { MdOutlineAttachMoney, MdOutlineAccountCircle } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import styles from './styles.module.scss';

const menuData = [
  { id: 1, label: 'Tổng quan & Báo cáo', icon: <GoHome size={22} />, path: '/dashboard/overview' },
  { id: 2, label: 'Nhân viên', icon: <FaRegUser size={22} />, path: '/dashboard/employees' },
  { id: 3, label: 'Lương & Chấm công', icon: <MdOutlineAttachMoney size={22} />, path: '/dashboard/salary-attendance' },
  { id: 4, label: 'Phòng ban', icon: <SiGoogleclassroom size={22} />, path: '/dashboard/departments' },
  { id: 5, label: 'Chức danh', icon: <GiPositionMarker size={22} />, path: '/dashboard/positions' },
  { id: 6, label: 'Tài khoản', icon: <MdOutlineAccountCircle size={22} />, path: '/dashboard/accounts' },
  { id: 7, label: 'Chấm công', icon: <IoMdTime size={22} />, path: '/dashboard/timekeeping' },
  { id: 8, label: 'Tài khoản cá nhân', icon: <MdOutlineAccountCircle size={22} />, path: '/dashboard/personal-account' },
];

const logoutItem = { label: 'Logout', icon: <CiLogout size={22} /> };

function MenuService() {
  const { sidebar, title, menuList, menuItem, active, icon, logout } = styles;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user ? user.role : null;

  const filteredMenuData = menuData.filter((item) => {
    if (userRole === 1) {
      return true;
    }
    if (userRole === 2) {
      return !['Lương & Chấm công', 'Phòng ban', 'Chức danh', 'Tài khoản'].includes(item.label);
    }
    if (userRole === 3) {
      return !['Nhân viên', 'Phòng ban', 'Chức danh', 'Tài khoản'].includes(item.label);
    }
    if (userRole === 4) {
      return !['Nhân viên', 'Lương & Chấm công', 'Phòng ban', 'Chức danh', 'Tài khoản'].includes(item.label);
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={sidebar}>
      <h2 className={title}>HR Dashboard</h2>
      <ul className={menuList}>
        {filteredMenuData.map((item) => (
          <li key={item.id} className={menuItem}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? `${menuItem} ${active}` : menuItem)}
              end
            >
              <span className={icon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={logout} onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <span className={icon}>{logoutItem.icon}</span>
        <span>{logoutItem.label}</span>
      </div>
    </div>
  );
}

export default MenuService;
