import React, {useState} from 'react';
import ReactPaginate from 'react-paginate';
import CartEmployee from '../CartEmployee/CartEmployee';
import styles from './styles.module.scss';
import {GrFormNextLink} from 'react-icons/gr';
import {IoArrowBackSharp} from 'react-icons/io5';

function ListCardEmployees({employees}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const offset = currentPage * itemsPerPage;
  const currentItems = employees.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(employees.length / itemsPerPage);

  const handlePageClick = ({selected}) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <div>
      <div className={styles.controlPanel}>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={12}>12</option>
          <option value={18}>18</option>
          <option value={24}>24</option>
          <option value={employees.length}>Tất cả</option>
        </select>
      </div>

      <div className={styles.wrapper}>
        {currentItems.map((emp) => (
          <CartEmployee key={emp.EmployeeID} employee={emp} />
        ))}
      </div>

      {pageCount > 1 && <ReactPaginate previousLabel={<IoArrowBackSharp />} nextLabel={<GrFormNextLink />} pageCount={pageCount} onPageChange={handlePageClick} containerClassName={styles.pagination} activeClassName={styles.active} />}
    </div>
  );
}

export default ListCardEmployees;
