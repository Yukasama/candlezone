import { router } from "./trpc";
import { portfolioRouter } from "./routers/portfolio";
import { userRouter } from "./routers/user";
import { stockRouter } from "./routers/stock";

export const appRouter = router({
  portfolio: portfolioRouter,
  stock: stockRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
