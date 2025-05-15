import styles from './styles.module.scss';
import {FiUsers} from 'react-icons/fi';
import {CiPen} from 'react-icons/ci';
import {MdOutlineDeleteOutline} from 'react-icons/md';

function Position({positionName, staffCount}) {
  const {position_card, position_header, position_icon, edit_icon, staff_count, view_details, position_header__one} = styles;
  return (
    <div className={position_card}>
      <div className={position_header}>
        <div className={position_header__one}>
          <span className={position_icon}>
            <FiUsers size={'24px'} />
          </span>
          <h3>{positionName}</h3>
        </div>
        <div>
          <span className={edit_icon}>
            <MdOutlineDeleteOutline size={'24px'} />
          </span>
          <span className={edit_icon}>
            <CiPen size={'24px'} />
          </span>
        </div>
      </div>
      <p className={staff_count}>{staffCount} staff</p>
      <a href="#" className={view_details}>
        View details
      </a>
    </div>
  );
}

export default Position;
