import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.scss';

function SalaryChart() {
  const [data, setData] = useState([]);
  const employeeId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    if (!employeeId) return;

    axios
      .get('http://localhost:3000/api/getSalaryByEmployeeID', {
        params: { employeeID: employeeId },
      })
      .then((res) => {
        setData(res.data); 
      })
      .catch((err) => {
        console.error('Lỗi khi lấy dữ liệu biểu đồ:', err);
      });
  }, [employeeId]);

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Biểu đồ Lương theo tháng</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="NetSalary" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalaryChart;
