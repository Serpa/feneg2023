import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                if (token) { return true; }
                // else if (req.cookies) return true;
                return false;
            },
        }
    }

);
export const config = { matcher: ["/", "/presenca", "/profile"] };