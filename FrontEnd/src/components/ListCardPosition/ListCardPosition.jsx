import {useEffect, useState} from 'react';
import axios from 'axios';
import {FaUsers, FaUserTie, FaUserCog, FaCalculator} from 'react-icons/fa';
import StartCard from '../StartCard/StartCard';
import styles from './styles.module.scss'; 

const positionConfig = {
  'Thực tập sinh': {
    icon: <FaUsers size={24} color="white" />,
    color: '#4CAF50',
  },
  'Nhân viên': {
    icon: <FaUserCog size={24} color="white" />,
    color: '#2196F3',
  },
  'Trưởng phòng': {
    icon: <FaCalculator size={24} color="white" />,
    color: '#FF9800',
  },
  'Giám đốc': {
    icon: <FaUserTie size={24} color="white" />,
    color: '#9C27B0',
  },
};

function ListCardPosition() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTotalPosition = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/totalPosition');
        setData(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu chức vụ:', error);
      }
    };

    fetchTotalPosition();
  }, []);

  return (
    <div className={styles.container}>
      {data.map((item, index) => {
        const config = positionConfig[item.PositionName] || {
          icon: <FaUsers size={24} color="white" />,
          color: '#777',
        };
        return <StartCard key={index} icons={config.icon} titles={item.PositionName} numbers={item.TotalEmployees} backgroundColor={config.color} />;
      })}
    </div>
  );
}

export default ListCardPosition;
