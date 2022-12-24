import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const guestbookRouter = router({
  getAllMessages: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestBook.findMany({
        select: {
          name: true,
          message: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }),
  addMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.guestBook.create({
          data: {
            name: input.name,
            message: input.message,
          },
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
});
