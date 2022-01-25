import Link from 'next/link';
import Image from 'next/image';
import cls from 'classnames';

import styles from './card.module.css';

const Card = props => {
  return (
    <Link href={props.href}>
      <div className={cls('glass', styles.container)}>
        <a className={styles.cardLink}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={props.imgUrl}
              width={320}
              height={180}
            />
          </div>
        </a>
      </div>
    </Link>
  );
};

export default Card;
