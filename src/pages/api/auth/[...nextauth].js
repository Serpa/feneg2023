import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../utils/prismadb"
const bcrypt = require('bcrypt');

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                const dbUser = await prisma.User.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (dbUser) {
                    if (await bcrypt.compare(credentials.password, dbUser.password)) {
                        delete dbUser.password
                        return dbUser
                    }
                }
                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, user, token }) {
            session.user = token.user;
            return session
        },
        async jwt({ token, trigger, user, account, session }) {
            if (trigger === "update" && session?.name) {
                token.user = session
            }
            if (typeof user !== typeof undefined) {
                token.user = user;
            }
            return token;
        }
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
    }
}

export default NextAuth(authOptions)