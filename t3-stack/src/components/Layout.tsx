import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Avatar } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Puff } from 'react-loader-spinner';

interface LayoutProps {
  children: React.ReactNode;
  home?: boolean;
}

export default function Layout({ children, home }: LayoutProps) {
  const { data: session } = useSession();
  const [image, setImage] = useState<string | undefined>('');
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();
  const navigateProfile = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
    }, 4000);
    router.push({
      pathname: '/profile/[slug]',
      query: { slug: session?.user?.id },
    });
  };

  useEffect(() => {
    if (session?.user?.image) {
      setImage(session.user.image);
    }
  }, [session]);

  if (home) {
    return (
      <>
        <Head>
          <title>T3 Stack - Nyumat</title>
          <meta name='description' content='Home Page of the NyumatT3Stack' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] pb-16'>
          <div className='container mr-16 mb-16 flex flex-row items-center justify-end gap-16'>
            {session?.user?.image ? (
              <div className='flex flex-col items-center justify-center gap-4'>
                {isNavigating ? (
                  <Puff
                    height='40'
                    width='40'
                    radius={1}
                    color='#a37cda'
                    ariaLabel='puff-loading'
                    wrapperStyle={{}}
                    wrapperClass=''
                    visible={true}
                  />
                ) : (
                  <Avatar
                    size='lg'
                    src={image}
                    bordered
                    color='gradient'
                    className='hover:cursor-pointer'
                    onClick={navigateProfile}
                  />
                )}
                <h1 className='text-sm font-extrabold tracking-tight text-white'>
                  {session.user?.name}
                </h1>
              </div>
            ) : null}
          </div>
          <div className='container flex flex-col items-center justify-center gap-8 px-4'>
            <h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]'>
              <div className='flex flex-col items-center justify-center'>
                <span className='bg-gradient-to-r from-[hsl(280,100%,70%)] to-[#7113f5] bg-clip-text text-8xl font-extrabold text-transparent'>
                  Meet<span className='text-white'>U</span>
                </span>
                <div className='flex w-min flex-row items-center justify-center gap-4'>
                  <span className='bg-gradient-to-r from-[hsl(280,100%,70%)] to-[#7113f5] bg-clip-text text-2xl font-extrabold text-transparent'>
                    Find
                  </span>
                  <span className='text-2xl text-white'>and</span>
                  <span className='bg-gradient-to-r from-[hsl(280,100%,70%)] to-[#7113f5] bg-clip-text text-2xl font-extrabold text-transparent'>
                    Post
                  </span>
                  <span className='text-2xl text-white'>your</span>
                  <span className='bg-gradient-to-r from-[hsl(280,100%,70%)] to-[#7113f5] bg-clip-text text-2xl font-extrabold text-transparent'>
                    Messages,
                  </span>
                  <span className='text-2xl text-white'>publicly.</span>
                </div>
              </div>
            </h1>

            <div className='flex flex-col items-center gap-6'>
              <Auth />
              <NavigateToGuestBook />
            </div>
          </div>
        </main>
      </>
    );
  } else {
    return <div>{children}</div>;
  }
}

const Auth: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='pb-8 text-center text-2xl text-white'>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
};

const NavigateToGuestBook: React.FC = () => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return null;
  } else {
    return (
      <Link href='/guestbook'>
        <button className='rounded-full bg-white/10 px-6 py-3 font-semibold text-white no-underline transition hover:bg-white/20'>
          Guestbook
        </button>
      </Link>
    );
  }
};
