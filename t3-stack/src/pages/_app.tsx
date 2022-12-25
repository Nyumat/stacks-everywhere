import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
// import DownUpTransition from '../components/DownUpTransition';
// import UpUpTransition from '../components/UpUpTransition';
import PopOutTransition from '../components/PopOutTransition';
import { NextUIProvider } from '@nextui-org/react';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';
import '../styles/transition.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <NextUIProvider>
    <PopOutTransition>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      </PopOutTransition>
    </NextUIProvider>
  );
};

export default trpc.withTRPC(MyApp);
