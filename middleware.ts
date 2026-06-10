import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/library/:path*",
    "/discover/:path*",
    "/review/:path*",
    "/test/:path*",
    "/deck/:path*",
    "/profile/:path*",
  ],
};
