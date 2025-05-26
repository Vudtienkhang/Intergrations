import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Department from '../Department/Department';
import styles from './styles.module.scss';

function ListDepartment({onViewDetail}) {
  const {listDepartment} = styles;
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getDepartmentSql');
        setDepartment(response.data);
      } catch (error) {
        console.error('Lỗi lấy danh sách phòng ban', error);
      }
    };
    fetchDepartment();
  }, []);

  const handleDelete = (deletedId) => {
    setDepartment(prev => prev.filter(dep => dep.departmentId !== deletedId));
  };

  return (
    <div className={listDepartment}>
      {department.map((dep) => (
        <Department
          key={dep.DepartmentID}
          departmentId={dep.DepartmentID}
          departmentName={dep.DepartmentName}
          employeeCount={dep.employeeCount}
          description={dep.Description}
          onDelete={handleDelete}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}

export default ListDepartment;