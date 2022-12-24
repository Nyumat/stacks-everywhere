import { router, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return 'Secret Message! 0.o';
  }),
});
