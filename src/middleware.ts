import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      console.log("Middleware executado em:", pathname, "Token:", token);
      const publicPaths = ["/login", "/register", "/forgot-password"];
      const isPublic = publicPaths.some((path) => pathname.startsWith(path));

      if (isPublic) return true;

      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
