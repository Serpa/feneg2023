import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                if (token) { return true; }
                return false;
            },
        }
    }

);
export const config = { matcher: ["/", "/presenca", "/profile","/adm/:path*"] };