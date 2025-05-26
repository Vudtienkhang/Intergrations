import styles from './styles.module.scss';
import {FiUsers} from 'react-icons/fi';
import {MdOutlineDeleteOutline} from 'react-icons/md';
import axios from 'axios';
import {useContext} from 'react';
import {ToastContext} from '../../Contexts/ToastProvider';

function Department({departmentId, departmentName, employeeCount, description, onDelete, onViewDetail}) {
  const {department_card, department_header, department_icon, edit_icon, employee_count, descriptions, view_details, department_header__one} = styles;
  const {toast} = useContext(ToastContext);
  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(departmentId);
    }
  };
  const handleDeleteDepartment = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá phòng ban này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/deletedDepartments/${departmentId}`);
        toast.success('Xoá Phòng ban thành công!');
        if (onDelete) onDelete(departmentId);
      } catch (error) {
        console.error('Lỗi khi xoá phòng ban:', error);

        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error('Xoá thất bại!');
        }
      }
    }
  };

  return (
    <div className={department_card}>
      <div className={department_header}>
        <div className={department_header__one}>
          <span className={department_icon} onClick={handleDeleteDepartment}>
            <FiUsers size={'24px'} />
          </span>
          <h3>{departmentName}</h3>
        </div>
        <div>
          <span className={edit_icon} onClick={handleDeleteDepartment}>
            <MdOutlineDeleteOutline size={'24px'} />
          </span>
        </div>
      </div>
      <p className={employee_count}>{employeeCount} employees</p>
      <p className={descriptions}>{description}</p>
      <button className={view_details} onClick={handleViewDetail}>
        View detail
      </button>
    </div>
  );
}

export default Department;
