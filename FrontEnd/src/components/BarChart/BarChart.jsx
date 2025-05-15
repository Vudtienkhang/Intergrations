import {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
import styles from './styles.module.scss';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function HorizontalBarChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/getDepartmentSql')
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => item.DepartmentName);
        const values = data.map((item) => item.employeeCount);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Employee Count',
              data: values,
              backgroundColor: '#4B5EAA',
              barThickness: 30,
              maxBarThickness: 35,
            },
          ],
        });
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
      });
  }, []);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    plugins: {
      legend: {display: false},
      title: {
        display: true,

        font: {size: 24},
        padding: {bottom: 10},
      },
      tooltip: {enabled: true},
    },
    scales: {
      x: {
        display: false,
        ticks: {display: false},
      },
      y: {
        ticks: {color: '#333', font: {size: 12}},
        grid: {display: false},
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
    datasets: {
      bar: {
        categoryPercentage: 1.5,
        barPercentage: 0.3,
      },
    },
  };

  return (
    <div className={styles.horizontal_bar_chart_container}>

      <Bar data={chartData} options={options} />
    </div>
  );
}

export default HorizontalBarChart;
