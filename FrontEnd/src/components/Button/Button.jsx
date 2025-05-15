import styles from './styles.module.scss';

function Button({ icon:Icon, name, onClick, type, className}) {
  const {button} = styles;
  return (
    <button type={type} onClick={onClick} className={`${button} ${className || ''}`}>
      {Icon && <Icon />}
      {name} 
    </button>
  );
}

export default Button;
