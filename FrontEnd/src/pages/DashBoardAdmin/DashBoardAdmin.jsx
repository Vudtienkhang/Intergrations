import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import MenuService from '../../components/MenuService/MenuService';
import StartCard from '../../components/StartCard/StartCard';
import styles from './styles.module.scss';
import {FaRegUser} from 'react-icons/fa';
import {MdAttachMoney} from 'react-icons/md';
import {LuTowerControl} from 'react-icons/lu';
import HorizontalBarChart from '../../components/BarChart/BarChart';
import Table_Employees from '../../components/Table_Employees/Table_Employees';
import ListUserTableSalari from '../../components/ListUserTableSalari/ListUserTableSalari';
import ListDepartment from '../../components/ListDepartment/ListDepartment';
import ListPosition from '../../components/ListPosition/ListPosition';
import MonthlySalaryChart from '../../components/BarChart/MonthlySalaryChart/MonthlySalaryChart';
import Account from '../../components/Account/Account';
import Notification from '../../components/Notifications/Notification';
import Timekeeping from '../../components/Timekeeping/Timekeeping';
import TableAttendance from '../../components/TableAttendance/TableAttendance';
import PersonalAccount from '../../components/PersonalAccount/PersonalAccount';
import StatusChart from '../../components/BarChart/StatusChart/StatusChart';
import GenderChart from '../../components/BarChart/GenderChart/GenderChart';
import DepartmentDetail from '../../components/DepartmentDetail/DepartmentDetail';
import ListCardPosition from '../../components/ListCardPosition/ListCardPosition';

function DashBoardAdmin() {
  const {header, menuService, content, startCard, barChart, wrapper, employees, department, topSection, bottomSection, pieChart} = styles;
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartment, setTotalDepartment] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [currentMonth, setCurrentMonth] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const location = useLocation();
  const handleViewDepartmentDetail = (id) => {
    setSelectedDepartmentId(id);
  };

  const handleBackToList = () => {
    setSelectedDepartmentId(null);
  };
  const roleId = JSON.parse(localStorage.getItem('user'))?.role;
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/gettotalEmployees')
      .then((res) => {
        if (res.data && res.data.totalEmployees) {
          setTotalEmployees(res.data.totalEmployees);
        }
      })
      .catch((err) => {
        console.error('Lỗi lấy số nhân viên:', err);
      });
  }, []);
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/gettotalDepartment')
      .then((res) => {
        if (res.data && res.data.totalDepartment) {
          setTotalDepartment(res.data.totalDepartment);
        }
      })
      .catch((err) => {
        console.error('Lỗi lấy số phòng ban:', err);
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/gettotalSalary')
      .then((res) => {
        if (res.data && res.data.totalSalary) {
          setTotalSalary(res.data.totalSalary);
          setCurrentMonth(res.data.currentMonth);
        }
      })
      .catch((err) => {
        console.error('Lỗi lấy tổng lương:', err);
      });
  }, []);

  const pathname = location.pathname;

  let activeMenu = '';
  if (pathname.startsWith('/dashboard/overview')) activeMenu = 'Tổng quan & Báo cáo';
  else if (pathname.startsWith('/dashboard/employees')) activeMenu = 'Nhân viên';
  else if (pathname.startsWith('/dashboard/salary-attendance')) activeMenu = 'Lương & Chấm công';
  else if (pathname.startsWith('/dashboard/departments')) activeMenu = 'Phòng ban';
  else if (pathname.startsWith('/dashboard/positions')) activeMenu = 'Chức danh';
  else if (pathname.startsWith('/dashboard/accounts')) activeMenu = 'Tài khoản';
  else if (pathname.startsWith('/dashboard/timekeeping')) activeMenu = 'Chấm công';
  else if (pathname.startsWith('/dashboard/personal-account')) activeMenu = 'Tài khoản cá nhân';

  return (
    <div>
      <div className={header}>
        <Header />
      </div>
      <div className={wrapper}>
        <div className={menuService}>
          <MenuService />
        </div>
        <div className={content}>
          {activeMenu === 'Tổng quan & Báo cáo' && (
            <>
              {roleId !== 4 && (
                <div className={startCard}>
                  <StartCard icons={<FaRegUser />} titles={'Total Employees'} backgroundColor={'blue'} numbers={totalEmployees} />
                  <StartCard icons={<MdAttachMoney />} titles={`Salary Budget - Tháng ${currentMonth}`} backgroundColor={'#21C65D'} numbers={totalSalary} />
                  <StartCard icons={<LuTowerControl />} titles={'Department'} backgroundColor={'#EBB306'} numbers={totalDepartment} />
                </div>
              )}
              <div className={barChart}>
                <div className={topSection}>
                  <HorizontalBarChart />
                  <Notification />
                </div>
                <div className={bottomSection}>
                  <MonthlySalaryChart />
                  <div className={pieChart}>
                    <StatusChart />
                    <GenderChart />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeMenu === 'Nhân viên' && (
            <div className={employees}>
              <Table_Employees />
            </div>
          )}
          {activeMenu === 'Lương & Chấm công' && (
            <div className={employees}>
              <h1>Lương & chấm công</h1>
              <ListUserTableSalari />
              <TableAttendance />
            </div>
          )}
          {activeMenu === 'Phòng ban' && (
            <div className={department}>
              <h1>Danh Sách Phòng Ban</h1>
              {selectedDepartmentId ? <DepartmentDetail id={selectedDepartmentId} onBack={handleBackToList} /> : <ListDepartment onViewDetail={handleViewDepartmentDetail} />}
            </div>
          )}
          {activeMenu === 'Chức danh' && (
            <div className={department}>
              <h1>Chức danh</h1>
              <ListPosition />
              <ListCardPosition/>
            </div>
          )}
          {activeMenu === 'Tài khoản' && (
            <div className={department}>
              <Account />
            </div>
          )}
          {activeMenu === 'Chấm công' && (
            <div className={department}>
              <Timekeeping />
            </div>
          )}
          {activeMenu === 'Tài khoản cá nhân' && (
            <div className={department}>
              <PersonalAccount />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoardAdmin;
