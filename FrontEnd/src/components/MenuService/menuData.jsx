import { GoHome } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { SiGoogleclassroom } from "react-icons/si";
import { GiPositionMarker } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";
const menuData = [
    {id: 1,label: 'Tổng quan & Báo cáo', icon: <GoHome size={22} />, isActive: true },
    {id: 2,label: 'Nhân viên', icon: <FaRegUser size={22} />, isActive: false },
    {id: 3,label: 'Lương & Chấm công', icon: <MdOutlineAttachMoney size={22} />, isActive: false },
    {id: 4,label: 'Phòng ban', icon: <SiGoogleclassroom size={22} />, isActive: false },
    {id: 5,label: 'Chức danh', icon: <GiPositionMarker size={22} />, isActive: false },
    {id: 6,label: 'Tài khoản', icon: <MdOutlineAccountCircle size={22} />, isActive: false },
    {id: 7,label: 'Chấm công', icon: <MdOutlineAccountCircle size={22} />, isActive: false },
    {id: 8,label: 'Tài khoản cá nhân', icon: <MdOutlineAccountCircle size={22} />, isActive: false },
  ];
  
  const logoutItem = { label: 'Logout', icon: <CiLogout size={22}/> };
  
  export { menuData, logoutItem };