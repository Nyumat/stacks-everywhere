import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import moment from 'moment';
import { Puff } from 'react-loader-spinner';
import { ThreeDots } from 'react-loader-spinner';
import Layout from '../../components/Layout';

const Messages = () => {
  const { data: messages, isLoading } = trpc.guestbook.getAllMessages.useQuery();

  if (isLoading) {
    return (
      <ThreeDots
        height='80'
        width='80'
        radius='9'
        color='#a37cda'
        ariaLabel='three-dots-loading'
        visible={true}
      />
    );
  }

  return (
    <div className='flex flex-col text-center'>
      <header className='text-white-800 pl-16 text-left text-2xl font-bold text-white'>
        Messages from the community
      </header>
      {messages?.map((message, i) => (
        <div key={i} className='mb-4 flex flex-col justify-center px-4 pb-4 text-white'>
          <p className='text-white-800 mx-4 mt-2 mb-5 w-screen rounded-lg border-4 border-x-8 border-y-2 border-[#a37cda] p-4 text-start text-3xl hover:bg-white/20'>
            {message.message}
            <div className='relative bottom-4 flex flex-row justify-center gap-4'>
              <LikeButton id={message.id} likes={message.likes.length} />
              <DislikeButton id={message.id} dislikes={message.dislikes.length} />
            </div>
            <span className='float-right text-4xl text-[hsl(280,100%,70%)]'>{message.name}</span>
            <span className=' mt-2 text-base'>{moment(message.createdAt).calendar()}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

const LikeButton = ({ id, likes }: { id: string; likes: number }) => {
  const utils = trpc.useContext();

  const [likeCount, setLikeCount] = useState(0);

  const likeMessage = trpc.guestbook.likeMessage.useMutation({
    onMutate: () => {
      utils.guestbook.getAllMessages.cancel();
    },
    onSettled: () => {
      utils.guestbook.getAllMessages.invalidate();
    },
  });

  const handleClick = async (id: string) => {
    likeMessage.mutate({ id });
    setLikeCount(likeCount + 1);
  };

  useEffect(() => {
    setLikeCount(likes);
  }, [likes]);

  const { isLoading } = trpc.guestbook.getLikesForMessage.useQuery({ id });

  if (isLoading) {
    return (
      <div className='flex flex-col place-items-center'>
        <Puff
          height='80'
          width='80'
          radius={1}
          color='#a37cda'
          ariaLabel='puff-loading'
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className='relative top-16 flex h-min flex-col items-center justify-center gap-2'>
      <h2 className='text-white-800 text-left text-lg font-bold text-white'>
        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}{' '}
      </h2>
      <button
        className='rounded-md bg-[#a37cda] px-2 py-2 text-lg text-white'
        onClick={() => handleClick(id)}
      >
        Like
      </button>
    </div>
  );
};

const DislikeButton = ({ id, dislikes }: { id: string; dislikes: number }) => {
  const utils = trpc.useContext();

  const [dislikeCount, setDislikeCount] = useState(0);

  const dislikeMessage = trpc.guestbook.dislikeMessage.useMutation({
    onMutate: () => {
      utils.guestbook.getAllMessages.cancel();
    },
    onSettled: () => {
      utils.guestbook.getAllMessages.invalidate();
    },
  });

  const handleClick = async (id: string) => {
    dislikeMessage.mutate({ id });
    setDislikeCount(dislikeCount + 1);
  };

  useEffect(() => {
    setDislikeCount(dislikes);
  }, [dislikes]);

  const { isLoading } = trpc.guestbook.getDislikesForMessage.useQuery({ id });

  if (isLoading) {
    return (
      <div className='flex flex-col place-items-center'>
        <Puff
          height='80'
          width='80'
          radius={1}
          color='#a37cda'
          ariaLabel='puff-loading'
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className='relative top-16 flex h-min flex-col items-center justify-center gap-2'>
      <h2 className='text-white-800 text-left text-lg font-bold text-white'>
        {dislikeCount} {dislikeCount === 1 ? 'Dislike' : 'Dislikes'}{' '}
      </h2>
      <button
        className='rounded-md bg-[#a37cda] px-2 py-2 text-lg text-white'
        onClick={() => handleClick(id)}
      >
        Dislike
      </button>
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
    <>
      <p className='text-white-800 text-left text-2xl font-bold text-white'>Leave a message!</p>
      <form
        className='border-w-6 border-800 flex flex-row items-center justify-center gap-4 rounded-md border p-4'
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
    </>
  );
};

export default function Guestbook(): JSX.Element {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className='flex flex-col place-items-center'>
        <Puff
          height='80'
          width='80'
          radius={1}
          color='#a37cda'
          ariaLabel='puff-loading'
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
        />
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Message Board</title>
        <meta name='description' content='Guestbook' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
        <div className='container flex flex-col items-center justify-center gap-16 px-4 py-16 '>
          <h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]'>
            <span className='bg-gradient-to-r from-[hsl(280,97%,44%)] to-[#6a00ff] bg-clip-text text-7xl font-extrabold text-transparent'>
              Message Board
            </span>
          </h1>

          {session?.user ? (
            <>
              <div className='flex flex-col items-center justify-center gap-6'>
                <Link href='/'>
                  <button className='rounded-md bg-[#9c68e4] px-4 py-2 text-white'>
                    Return Home
                  </button>
                </Link>
                <h2 className='text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]'>
                  Welcome {session.user?.name}
                </h2>
                <Form />
              </div>
              <div>
                <Messages />
              </div>
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
    </Layout>
  );
}
