import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles.module.scss'; 
import CartEmployee from '../CartEmployee/CartEmployee';

function DepartmentDetail() {
  const {id} = useParams(); 
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/getDepartment/${id}`);
        setEmployees(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu nhân viên:', err);
      }
    };
    fetchEmployees();
  }, [id]);

  return (
    <div className={styles.detailWrapper}>
      <h2>Danh sách nhân viên phòng ban {id}</h2>
      <div className={styles.employeeList}>
        {employees.map((emp) => (
            <CartEmployee key={emp.EmployeeID} employee={emp}/>
        ))}
      </div>
    </div>
  );
}

export default DepartmentDetail;
