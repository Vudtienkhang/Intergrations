import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer} from 'recharts';
import styles from './styles.module.scss';

function TimekeepingChart({data}) {
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TotalWorkDays" fill="#4caf50" name="Ngày làm" />
          <Bar dataKey="TotalLeaveDays" fill="#2196f3" name="Nghỉ phép" />
          <Bar dataKey="TotalAbsentDays" fill="#f44336" name="Nghỉ không phép" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TimekeepingChart;
