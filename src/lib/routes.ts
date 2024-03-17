export const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/auth/error",
  "/reset",
  "/new-password",
];

export const publicRoutes = [
  "/",
  "/screener",
  "/p/:path*",
  "/stocks/:path*",
  "/u/:path*",
  "/auth/new-verification",
];

export const apiAuthPrefix = "/api";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
