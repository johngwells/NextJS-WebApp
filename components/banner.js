import styles from './banner.module.css';

const Banner = props => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>& Cream</span>
      </h1>
      <p className={styles.subTitle}>Discover local coffee shops!</p>
      <button className={styles.button} onClick={props.onClick}>
        {props.buttonText}
      </button>
    </div>
  );
};

export default Banner;
