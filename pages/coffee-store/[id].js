import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';

// font awesome
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fetchCoffeeStores } from '../lib/coffee-stores';
import { StoreContext } from '../../store/store-context';
import { isEmpty } from '../../utils';

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  // console.log('params', params);

  const coffeeStoresData = await fetchCoffeeStores();

  const findCoffeeStoreById = coffeeStoresData.find(coffeeStore => {
    return coffeeStore.id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
    }
  };
}

export async function getStaticPaths() {
  const coffeeStoresData = await fetchCoffeeStores();
  const paths = coffeeStoresData.map(coffeeStore => {
    return {
      params: {
        id: coffeeStore.id.toString()
      }
    };
  });
  return {
    paths,
    fallback: true
  };
}

const CoffeeStore = initialProps => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading. . .</div>;
  }

  const id = router.query.id;

  const [coffeeStore, setCoffeStore] = useState(initialProps.coffeeStore);

  const {
    state: { coffeeStores }
  } = useContext(StoreContext);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find(coffeeStore => {
          return coffeeStore.id.toString() === id;
        });
        setCoffeStore(findCoffeeStoreById);
      }
    }
  }, [id]);

  const { name, address, neighborhood, imgUrl } = coffeeStore;

  const handleUpvoteButton = () => {
    console.log('voted!');
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      {/* Coffee Store Page {router.query.id} */}
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.linkWrapper}>
            <Link href='/'>
              <a>
                <FontAwesomeIcon icon={faLongArrowAltLeft} /> Back to home
              </a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src='/static/icons/nearMe.svg' width='24' height='24' />
            <p className={styles.text}>{address}</p>
          </div>
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/places.svg' width='24' height='24' />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src='/static/icons/star.svg' width='24' height='24' />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
