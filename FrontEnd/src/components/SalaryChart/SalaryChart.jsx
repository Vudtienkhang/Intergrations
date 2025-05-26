import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer} from 'recharts';

import styles from './styles.module.scss';

function SalaryChart({data}) {
  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Biểu đồ Lương theo tháng</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{top: 20, right: 30, left: 40, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="SalaryMonth" tickFormatter={(value) => new Date(value).toISOString().slice(0, 7)} />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => {
              const date = new Date(value);
              return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="NetSalary" stroke="#8884d8" activeDot={{r: 8}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalaryChart;
