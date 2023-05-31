import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // const path = req.nextUrl.pathname;
                // if (path.startsWith("/adm")) {
                //     console.log('teste');
                //     return token?.adm ? token?.adm : NextResponse.redirect(req.url.replace(path, ''));
                // }
                if (token) { return true; }
                return false;
            },
        }
    }

);
export const config = { matcher: ["/", "/presenca/:path*", "/profile/:path*", "/adm/:path*"] };