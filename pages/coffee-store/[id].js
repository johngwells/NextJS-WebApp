import { useRouter } from 'next/router';
import Link from 'next/link';

import coffeeStoresData from '../../data/coffee-stores.json';

export function getStaticProps(staticProps) {
  const params = staticProps.params;
  console.log('params', params);
  return {
    props: {
      coffeeStore: coffeeStoresData.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id;
      })
    }
  };
}

export function getStaticPaths() {
  return {
    paths: [{ params: { id: '0' } }, { params: { id: '1' } }],
    fallback: true
  };
}

const CoffeeStore = props => {
  console.log('props', props);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading. . .</div>;
  }

  return (
    <div>
      Coffee Store Page {router.query.id}
      <br></br>
      <Link href='/'>
        <a>Back to home</a>
      </Link>
      <br></br>
      <p>{props.coffeeStore.name}</p>
      <p>{props.coffeeStore.address}</p>
    </div>
  );
};

export default CoffeeStore;
