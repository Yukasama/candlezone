import { getUser } from "@/lib/auth";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (options) => {
  const user = await getUser();

  if (!user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return options.next({ ctx: { user } });
});

const isAdmin = middleware(async (options) => {
  const user = await getUser();

  if (!user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (user?.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return options.next({ ctx: { user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
export const adminProcedure = t.procedure.use(isAdmin);
