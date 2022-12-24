import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
// import DownUpTransition from '../components/DownUpTransition';
import UpUpTransition from '../components/UpUpTransition';
// import PopOutTransition from '../components/PopOutTransition';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';
import '../styles/transition.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <UpUpTransition>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </UpUpTransition>
  );
};

export default trpc.withTRPC(MyApp);
