import styles from "./styles.module.scss"
function StartCard({icons, titles, numbers, backgroundColor}) {
    const {card, icon, content, title, stats, number} = styles
  return (
    <div className={card}>
      <div className={icon} style={{backgroundColor: backgroundColor}}>{icons}</div>
      <div className={content}>
        <p className={title}>{titles}</p>
        <div className={stats}>
          <span className={number}>{numbers}</span>
        </div>
      </div>
    </div>
  );
}

export default StartCard;
