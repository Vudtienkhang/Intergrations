import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import {MdBrowserUpdated} from 'react-icons/md';
import {MdDeleteOutline} from 'react-icons/md';
import {IoAdd} from 'react-icons/io5';

function ListPosition() {
  const {listPosition, table, filterSection, actionBtn, editBtn, deleteBtn, modal, modalContent, modalActions, container_table} = styles;

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [newPosition, setNewPosition] = useState({
    PositionName: '',
    Description: '',
    MinSalary: '',
    MaxSalary: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/getPositionSql');
      setPositions(response.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách chức danh: ', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPositions = positions.filter((pos) => pos.PositionName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleUpdate = async () => {
    try {
      await axios.post(`http://localhost:3000/api/updatePosition/${editing.PositionID}`, editing);
      setEditing(null);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi cập nhật chức danh:', error);
      alert('Cập nhật thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá chức danh này?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/deletePosition/${id}`);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi xoá:', error);
      alert('Xoá thất bại!');
    }
  };

  const handleAddPosition = async () => {
    const {PositionName, Description, MinSalary, MaxSalary} = newPosition;
    if (!PositionName || !MinSalary || !MaxSalary) {
      alert('Vui lòng nhập đầy đủ tên và lương!');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/addPosition', {
        PositionName,
        Description,
        MinSalary: parseInt(MinSalary),
        MaxSalary: parseInt(MaxSalary),
      });

      setNewPosition({PositionName: '', Description: '', MinSalary: '', MaxSalary: ''});
      setShowAddModal(false);
      fetchData();
      alert('Thêm chức danh thành công!');
    } catch (error) {
      console.error('Lỗi thêm chức danh:', error);
      alert('Thêm thất bại!');
    }
  };

  const renderEditModal = () => {
    if (!editing) return null;
    return (
      <div className={modal}>
        <div className={modalContent}>
          <h3>Sửa chức danh</h3>
          <label>
            Tên:
            <input type="text" value={editing.PositionName} onChange={(e) => setEditing({...editing, PositionName: e.target.value})} />
          </label>
          <label>
            Mô tả:
            <textarea value={editing.Description} onChange={(e) => setEditing({...editing, Description: e.target.value})} />
          </label>
          <label>
            Lương tối thiểu:
            <input type="number" value={editing.MinSalary} onChange={(e) => setEditing({...editing, MinSalary: parseInt(e.target.value)})} />
          </label>
          <label>
            Lương tối đa:
            <input type="number" value={editing.MaxSalary} onChange={(e) => setEditing({...editing, MaxSalary: parseInt(e.target.value)})} />
          </label>
          <div className={modalActions}>
            <button onClick={handleUpdate}>Lưu</button>
            <button onClick={() => setEditing(null)}>Hủy</button>
          </div>
        </div>
      </div>
    );
  };

  // Hiển thị modal thêm mới
  const renderAddModal = () => {
    return (
      <div className={modal}>
        <div className={modalContent}>
          <h3>Thêm chức danh mới</h3>
          <label>
            Tên chức danh:
            <input type="text" value={newPosition.PositionName} onChange={(e) => setNewPosition({...newPosition, PositionName: e.target.value})} />
          </label>
          <label>
            Mô tả:
            <textarea value={newPosition.Description} onChange={(e) => setNewPosition({...newPosition, Description: e.target.value})} />
          </label>
          <label>
            Lương tối thiểu:
            <input type="number" value={newPosition.MinSalary} onChange={(e) => setNewPosition({...newPosition, MinSalary: e.target.value})} />
          </label>
          <label>
            Lương tối đa:
            <input type="number" value={newPosition.MaxSalary} onChange={(e) => setNewPosition({...newPosition, MaxSalary: e.target.value})} />
          </label>
          <div className={modalActions}>
            <button onClick={handleAddPosition}>Thêm</button>
            <button onClick={() => setShowAddModal(false)}>Hủy</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className={listPosition}>
      <div className={filterSection}>
        <input type="text" placeholder="Tìm theo tên chức danh" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={() => setShowAddModal(true)}>
          <IoAdd /> Thêm
        </button>
      </div>
      <div className={container_table}>
        <table className={table}>
          <thead>
            <tr>
              <th>Position ID</th>
              <th>Position Name</th>
              <th>Description</th>
              <th>Range Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPositions.length > 0 ? (
              filteredPositions.map((pos) => (
                <tr key={pos.PositionID}>
                  <td>{pos.PositionID}</td>
                  <td>{pos.PositionName}</td>
                  <td>{pos.Description}</td>
                  <td>
                    {pos.MinSalary} - {pos.MaxSalary}
                  </td>
                  <td>
                    <button className={`${actionBtn} ${editBtn}`} onClick={() => setEditing({...pos})}>
                      <MdBrowserUpdated size={'24px'} />
                    </button>
                    <button className={`${actionBtn} ${deleteBtn}`} onClick={() => handleDelete(pos.PositionID)}>
                      <MdDeleteOutline size={'24px'} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Không có chức danh nào được tìm thấy.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {renderEditModal()}
      {showAddModal && renderAddModal()}
    </div>
  );
}

export default ListPosition;
