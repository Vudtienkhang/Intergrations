import {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles.module.scss';

function TableAttendance() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Tất cả');

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/getAllAttendance')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Lỗi khi lấy dữ liệu chấm công:', err);
      });
  }, []);

  const uniqueMonths = ['Tất cả', ...Array.from(new Set(data.map((item) => item.Month)))];

  const filteredData = data.filter((item) => (item.FullName?.toLowerCase().includes(search.toLowerCase()) || '') && (selectedMonth === 'Tất cả' || item.Month === selectedMonth));

  return (
    <div className={styles.attendanceTable}>
      <h2>Danh sách chấm công theo tháng</h2>

      <div className={styles.filters}>
        <input type="text" placeholder="Tìm kiếm theo tên nhân viên..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchInput} />
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className={styles.monthSelect}>
          {uniqueMonths.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Tên nhân viên</th>
              <th>Tháng</th>
              <th>Ngày làm</th>
              <th>Ngày nghỉ phép</th>
              <th>Ngày vắng</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.FullName}</td>
                <td>{row.Month}</td>
                <td>{row.TotalWorkDays}</td>
                <td>{row.TotalLeaveDays}</td>
                <td>{row.TotalAbsentDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableAttendance;
