import { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import Banner from '../components/banner';

import heroPic from '../public/static/hero.png';
import Card from '../components/card';

import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStores
    }
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  // console.log({ latLong, locationErrorMsg });

  useEffect(async () => {
    if (latLong) {
      try {
        const response = await fetch(
          `/api/getCoffeeStoresByLocation/?latLong=${latLong}&limit=30`
        );

        const coffeeStores = await response.json();

        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: { coffeeStores: coffeeStores }
        });
        setCoffeeStoresError('');
      } catch (err) {
        setCoffeeStoresError(err.message);
      }
    }
  }, [latLong]);

  const handleOnClick = () => {
    handleTrackLocation();
  };

  const ErrorHandler = errorHook => {
    return (
      <div className={styles.locationError}>
        something went wrong: {errorHook}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee & Cream</title>
        <meta name='description' content='NextJS Application Coffee Store to find coffee stores near you' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <div className={styles.heroContainer}>
          <div className={styles.imageContainer}>
            <Image className={styles.heroImg} src={heroPic} />
          </div>
          <Banner
            buttonText={
              isFindingLocation ? 'locating...' : 'view stores nearby'
            }
            onClick={handleOnClick}
          />
        </div>
        {locationErrorMsg && ErrorHandler(locationErrorMsg)}

        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Coffee Shops Near Me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(store => (
                <Card
                  key={store.id}
                  name={store.name}
                  imgUrl={
                    store.imgUrl ||
                    'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'
                  }
                  href={`/coffee-store/${store.id}`}
                  className={styles.card}
                  alt={store.name}
                />
              ))}
            </div>
          </>
        )}
        {coffeeStoresError && ErrorHandler(coffeeStoresError)}

        {props.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>San Francisco Coffee Shops</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(store => (
                <Card
                  key={store.id}
                  name={store.name}
                  imgUrl={
                    store.imgUrl ||
                    'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'
                  }
                  href={`/coffee-store/${store.id}`}
                  className={styles.card}
                  alt={store.name}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
