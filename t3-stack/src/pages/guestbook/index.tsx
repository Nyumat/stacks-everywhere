import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import moment from 'moment';

const Messages = () => {
  const { data: messages, isLoading } = trpc.guestbook.getAllMessages.useQuery();

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <div className='flex flex-col text-center'>
      <header className='text-white-800 pl-16 text-left text-2xl font-bold text-white'>
        Messages from the community
      </header>
      {messages?.map((message, i) => (
        <div key={i} className='mb-4 flex w-full flex-col justify-center px-4 pb-4'>
          <p className='text-white-800 mx-4 mt-2 mb-5 w-screen rounded-lg border-4 border-x-8 border-y-2 border-[#a37cda] p-4 text-start text-3xl hover:bg-white/20'>
            {message.message}
            <span className='float-right '>{message.name}</span>
            <div className='flex w-full flex-row justify-between'>
              <span className=' mt-2'>{moment(message.createdAt).format('LT')}</span>
            </div>
          </p>
        </div>
      ))}
    </div>
  );
};

const Form = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const utils = trpc.useContext();
  const postMessage = trpc.guestbook.addMessage.useMutation({
    onMutate: () => {
      utils.guestbook.getAllMessages.cancel();
    },
    onSettled: () => {
      utils.guestbook.getAllMessages.invalidate();
    },
  });

  return (
    <form
      className='flex flex-row items-center justify-center gap-4'
      onSubmit={(event) => {
        event.preventDefault();

        if (session !== null) {
          postMessage.mutate({
            name: session.user?.name as string,
            message,
          });
        }

        if (message.length < 2) return;

        setMessage('');
      }}
    >
      <input
        type='text'
        value={message}
        placeholder='Your message...'
        minLength={2}
        maxLength={100}
        onChange={(event) => setMessage(event.target.value)}
        className='rounded-md border-2 border-zinc-800 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#a37cda]'
      />
      <button type='submit' className='rounded-md bg-[#a37cda] px-4 py-2 text-white'>
        Submit
      </button>
    </form>
  );
};

export default function Guestbook(): JSX.Element {
  const { data: session, status } = useSession();

  if (status === 'loading')
    return <main className='flex flex-col items-center pt-4'>Loading...</main>;

  return (
    <>
      <Head>
        <title>T3 Stack - GuestBook</title>
        <meta name='description' content='Guestbook' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
        <div className='container flex flex-col items-center justify-center gap-16 px-4 py-16 '>
          <h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]'>
            Guestbook
          </h1>

          {session?.user ? (
            <>
              <div className='flex flex-col items-center justify-center gap-16'>
                <h2 className='text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]'>
                  Welcome {session.user?.name}
                </h2>
                <Form />
              </div>
              <div>
                <Messages />
              </div>
              <Link href='/'>
                <button className='rounded-md bg-[#2e026d] px-4 py-2 text-white'>
                  Return Home
                </button>
              </Link>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center gap-16'>
              <h2 className='text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]'>
                <span className='items-center justify-center text-center'>
                  You are not signed in.
                </span>
              </h2>
              <h2 className='text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]'>
                Please sign in to view the guestbook.
              </h2>
              <Link href='/'>
                <button className='rounded-md bg-[#2e026d] px-4 py-2 text-white'>
                  Return Home
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
