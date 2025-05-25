
import styles from './styles.module.scss';
import { motion } from 'framer-motion';

function CartEmployee({ employee }) {
  return (
    <motion.div
      className={styles.card}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imageWrapper}>
        <img src={employee.Img_url} alt={employee.FullName} className={styles.avatar} />
        <div className={styles.overlay}>
          <h3>{employee.FullName}</h3>
          <p><strong>Chức vụ:</strong> {employee.PositionName}</p>
          <p><strong>Phòng ban:</strong> {employee.DepartmentName}</p>
          <p><strong>Email:</strong> {employee.Email}</p>
          <p><strong>SĐT:</strong> {employee.PhoneNumber}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default CartEmployee;
