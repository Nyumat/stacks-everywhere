import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const guestbookRouter = router({
  getAllMessages: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestBook.findMany({
        select: {
          id: true,
          name: true,
          message: true,
          createdAt: true,
          likes: true,
          dislikes: true,
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
  likeMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.guestBook.update({
          where: {
            id: input.id,
          },
          data: {
            likes: {
              push: ctx.session.user.id,
            },
          },
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
  getLikesForMessage: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.guestBook.findUnique({
          where: {
            id: input.id,
          },
          select: {
            likes: true,
          },
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
  dislikeMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.guestBook.update({
          where: {
            id: input.id,
          },
          data: {
            dislikes: {
              push: ctx.session.user.id,
            },
          },
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
  getDislikesForMessage: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.guestBook.findUnique({
          where: {
            id: input.id,
          },
          select: {
            dislikes: true,
          },
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
});
