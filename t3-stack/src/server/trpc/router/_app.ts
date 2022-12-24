import { router } from '../trpc';
import { authRouter } from './auth';
import { guestbookRouter } from './guestbook';

export const appRouter = router({
  auth: authRouter,
  guestbook: guestbookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
