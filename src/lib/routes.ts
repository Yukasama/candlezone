export const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/auth/error",
  "/reset",
  "/new-password",
];

export const isPathPrivate = (pathname: string) => {
  const privateRoutes = [
    "/settings/(.*)",
    "/admin/(.*)",
    "/dashboard",
    "/portfolio",
  ];
  const regexPatterns = privateRoutes.map(
    (route) =>
      new RegExp(
        "^" + route.replace(/\//g, "\\/").replace(/\.\*\$/, ".*") + "$"
      )
  );
  return regexPatterns.some((pattern) => pattern.test(pathname));
};

export const apiAuthPrefix = "/api";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
