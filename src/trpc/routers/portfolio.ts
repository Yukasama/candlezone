import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import {
  CreatePortfolioSchema,
  EditPortfolioSchema,
  RemovePortfolioSchema,
} from "@/lib/validators/portfolio";
import { getRandomColor } from "@/lib/utils";
import { getUser } from "@/lib/auth";
import { MergeHistory } from "@/actions/fmp/history";
import { revalidatePath } from "next/cache";
import pino from "pino";

export const portfolioRouter = router({
  create: privateProcedure
    .input(CreatePortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { title, isPublic } = input;

      await db.portfolio.create({
        data: {
          title,
          isPublic: !!isPublic,
          userId: user.id,
          color: getRandomColor(),
        },
      });

      revalidatePath("/portfolio");
      pino().info({ userId: user.id, title, isPublic }, "Portfolio created.");
    }),
  edit: privateProcedure
    .input(EditPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId, title, isPublic } = input;

      await db.portfolio.update({
        data: {
          ...(title && { title }),
          ...(isPublic !== undefined && { isPublic: !!isPublic }),
        },
        where: {
          id: portfolioId,
          userId: user.id,
        },
      });

      revalidatePath(`/p/${portfolioId}`);
    }),
  add: privateProcedure
    .input(EditPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId, positions } = input;

      if (!positions?.length) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const portfolio = await db.portfolio.findFirst({
        select: {
          id: true,
          stocks: {
            select: { stockId: true },
          },
        },
        where: {
          id: portfolioId,
          userId: user.id,
        },
      });

      if (!portfolio) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const existingAndNewStockIds = await db.stock.findMany({
        where: {
          id: { in: positions.map((p) => p.stockId) },
          NOT: {
            portfolios: {
              some: { portfolioId: portfolioId },
            },
          },
        },
        select: { id: true },
      });

      const validStockIds = new Set(
        existingAndNewStockIds.map((stock) => stock.id)
      );
      const validPositions = positions.filter((p) =>
        validStockIds.has(p.stockId)
      );

      if (validPositions.length > 0) {
        await db.stockInPortfolio.createMany({
          data: validPositions.map((p) => ({
            portfolioId: portfolioId,
            stockId: p.stockId,
            quantity: p.quantity ?? 1,
            price: p.price,
          })),
        });
      }

      revalidatePath(`/p/${portfolioId}`);
    }),
  remove: privateProcedure
    .input(RemovePortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId, stockIds } = input;

      if (stockIds?.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await db.stockInPortfolio.deleteMany({
        where: {
          portfolioId: portfolioId,
          portfolio: {
            userId: user.id,
          },
          stockId: { in: stockIds },
        },
      });

      revalidatePath(`/p/${portfolioId}`);
    }),
  history: publicProcedure
    .input(
      z.object({
        portfolioId: z.string(),
        timeframe: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { portfolioId, timeframe } = input;

      const portfolioExists = await db.portfolio.findFirst({
        select: {
          isPublic: true,
          userId: true,
        },
        where: { id: portfolioId },
      });

      if (!portfolioExists) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (portfolioExists.isPublic) {
        return await MergeHistory(portfolioId, timeframe);
      }

      const user = await getUser();

      if (user?.id !== portfolioExists.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return await MergeHistory(portfolioId, timeframe);
    }),
  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: portfolioId }) => {
      const { user } = ctx;

      await db.portfolio.delete({
        where: {
          id: portfolioId,
          userId: user.id,
        },
      });

      revalidatePath("/portfolio");
      pino().info({ id: portfolioId, userId: user?.id }, "Portfolio deleted.");
    }),
});
