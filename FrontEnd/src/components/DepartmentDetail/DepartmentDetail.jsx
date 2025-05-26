import {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import CartEmployee from '../CartEmployee/CartEmployee';

function DepartmentDetail({id, onBack}) {
  const [employees, setEmployees] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/getDepartment/${id}`);
        const employeesData = res.data;
        setEmployees(employeesData);
        if (employeesData.length>0){
          setDepartmentName(employeesData[0].DepartmentName)
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu nhân viên:', err);
      }
    };
    fetchEmployees();
  }, [id]);

  return (
    <div className={styles.detailWrapper}>
      <button onClick={onBack}>← Quay lại danh sách</button>
      <h2>{departmentName}</h2>
      <div className={styles.employeeList}>
        {employees.map((emp) => (
          <CartEmployee key={emp.EmployeeID} employee={emp} />
        ))}
      </div>
    </div>
  );
}
export default DepartmentDetail;
