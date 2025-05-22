import {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
import styles from './styles.module.scss';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function MonthlySalaryChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const {container} = styles;
  useEffect(() => {
    fetch('http://localhost:3000/api/getMonthlySalaryReport')
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => `Tháng ${item.Month}`);
        const values = data.map((item) => item.TotalSalary);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Tổng lương theo tháng',
              data: values,
              backgroundColor: '#FFB84C',
              borderRadius: 5,
            },
          ],
        });
      })
      .catch((err) => {
        console.error('Lỗi khi lấy dữ liệu lương:', err);
      });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {position: 'top'},
      title: {
        display: true,
        text: 'Báo cáo lương theo tháng',
        font: {size: 14},
      },
    },
    scales: {
      x: {ticks: {color: '#333'}},
      y: {ticks: {color: '#333'}},
    },
  };

  return (
    <div className={container}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default MonthlySalaryChart;
