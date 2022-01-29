import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import useSWR from 'swr';

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

// anything we get from getStaticProps its good to call it initialProps
const CoffeeStore = initialProps => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading. . .</div>;
  }

  const id = router.query.id;

  // this will be the source of truth to get values
  // if the value is empty, go into the useEffect, check & set the coffeeStore
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const {
    state: { coffeeStores }
  } = useContext(StoreContext);
  
  const handleCreateCoffeeStore = async coffeeStore => {
    try {
      const { id, name, address, neighborhood, imgUrl, voting } = coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          name,
          address,
          neighborhood: neighborhood || '',
          imgUrl,
          voting: 0
        })
      });
      const dbCoffeeStore = await response.json();
      console.log({ dbCoffeeStore });
    } catch (err) {
      console.error('Error creating coffee store', err);
    }
  };

  // anytime id would change the route will change
  // isEmpty: will check if getStaticProps is an empty object
  // next line: checks if there are any values already stored
  // then set the coffeeStore found
  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreContext = coffeeStores.find(coffeeStore => {
          return coffeeStore.id.toString() === id;
        });

        if (coffeeStoreContext) {
          setCoffeeStore(coffeeStoreContext);
          handleCreateCoffeeStore(coffeeStoreContext);
        }
      }
    } else {
      // SSG - creating store for statically generated props
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const { name, address, neighborhood, imgUrl } = coffeeStore;

  
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  // get id: data from useSWR
  useEffect(() => {
    if (data && data.length > 0) {
      console.log('data from SWR', data);
      setCoffeeStore(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleUpvoteButton = () => {
    console.log('voted!');
    setVotingCount(votingCount + 1);
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
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
            <p className={styles.text}>{votingCount}</p>
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
