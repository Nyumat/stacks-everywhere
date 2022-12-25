import { type NextPage } from 'next';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <div>
      <Layout home>
        <h1>Home</h1>
      </Layout>
    </div>
  );
};

export default Home;
