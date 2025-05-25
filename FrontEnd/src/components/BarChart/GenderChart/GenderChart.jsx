import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Pie} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/getCountGender')
      .then((response) => {
        const data = response.data;

        const labels = data.map((item) => item.Gender);
        const values = data.map((item) => item.SoLuong);
        const colors = ['#2196f3', '#e91e63'];

        setChartData({
          labels,
          datasets: [
            {
              label: 'Trạng thái nhân viên',
              data: values,
              backgroundColor: colors,
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error);
      });
  }, []);

  return (
    <div style={{width: '250px', height:"250px", margin: '0 20 0 0'}}>
      {chartData ? <Pie data={chartData} /> : <p>Đang tải dữ liệu...</p>}
    </div>
  );
};

export default GenderChart;
