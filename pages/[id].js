import { useRouter } from 'next/router';
import Head from 'next/head';

const DynamicRoute = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{router.query.id}</title>
      </Head>
      <div>Page: {router.query.id}</div>
    </>
  );
};

export default DynamicRoute;
