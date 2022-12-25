import Image from 'next/image';
import Layout from '../../components/Layout';
import { prisma } from '../../server/db/client';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  name: string;
  email: string;
  id: string;
  image: string;
}

export async function getStaticPaths() {
  const users = await prisma.user.findMany();
  const paths = users.map((user) => ({
    params: { slug: user.id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const user = await prisma.user.findUnique({
    where: { id: params.slug },
  });
  return {
    props: {
      userData: user,
    },
  };
}

export default function Profile({ userData }: { userData: User }): JSX.Element {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const firstName = userData.name.split(' ')[0];
  return (
    <Layout>
      <div className='flex flex-col items-center justify-center gap-4 pt-24'>
        <button
          onClick={() => hover && router.push('/')}
          className={`flex flex-row items-center justify-center gap-4 rounded-md bg-gradient-to-b from-[#2e026d] to-[#15162c] py-4 px-8 shadow-lg ${
            hover ? 'hover:scale-105' : 'hover:scale-100'
          }`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <h1 className='text-2xl font-bold text-white'>
            {hover ? 'Return Home' : `${firstName + "'s"} Profile`}
          </h1>
        </button>

        <div className='flex w-8/12 flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] py-16 shadow-lg'>
          <div className='flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-4'>
              <Image
                src={userData.image}
                alt={userData.name}
                width={100}
                height={100}
                className='rounded-full'
              />
              <h1 className='text-3xl font-bold text-white'>{userData.name}</h1>
              <h1 className='text-2xl font-bold text-white'>{userData.email}</h1>
              <div className='border-white-800 flex w-min scale-75 flex-row items-center justify-center gap-4 border-t-2 border-b-2 pt-4 pb-4'>
                <div className='border-white-800 flex flex-col items-center justify-center gap-4 rounded-md border p-2'>
                  <h1 className='px-8 text-2xl font-bold text-white'>Likes</h1>
                  <h2 className='text-2xl font-bold text-white'>0</h2>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 rounded-md border p-2'>
                  <h1 className='px-6 text-2xl font-bold text-white'>Dislikes</h1>
                  <h2 className='text-2xl font-bold text-white'>0</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
