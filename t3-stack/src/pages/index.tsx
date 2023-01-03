import { type NextPage } from 'next';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div>
      <Layout home image={session?.user?.image} session={session}>
        <h1>Home</h1>
      </Layout>
    </div>
  );
};

export default Home;
