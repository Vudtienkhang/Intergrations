import {useState} from 'react';
import styles from './styles.module.scss';

function TableTimeKeepingByID({data}) {
  const [filteredMonth, setFilteredMonth] = useState('');
  const filteredData = filteredMonth ? data.filter((item) => item.Month === filteredMonth) : data;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bảng chấm công theo tháng</h2>
      <label className={styles.filterLabel}>
        Lọc theo tháng (yyyy-mm):
        <input type="month" value={filteredMonth} onChange={(e) => setFilteredMonth(e.target.value)} className={styles.monthInput} />
        {filteredMonth && (
          <button onClick={() => setFilteredMonth('')} className={styles.clearButton}>
            Xóa lọc
          </button>
        )}
      </label>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Ngày làm</th>
            <th>Nghỉ phép</th>
            <th>Nghỉ không phép</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" className={styles.noData}>
                Không có dữ liệu.
              </td>
            </tr>
          ) : (
            filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.Month}</td>
                <td>{row.TotalWorkDays}</td>
                <td>{row.TotalLeaveDays}</td>
                <td>{row.TotalAbsentDays}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableTimeKeepingByID;