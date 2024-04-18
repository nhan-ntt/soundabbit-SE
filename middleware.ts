import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    if (["/login", "/register", "/"].includes(req.nextUrl.pathname)) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/home', req.url));
        }

        return NextResponse.next();
    }

    const authMiddleware = await withAuth({
        pages: {
            signIn: `/login`,
        },
    });

    // @ts-expect-error
    return authMiddleware(req, event);
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/home",
        "/index",
        "/library",
        "/providers",
        "/queue",
        "/search",
        "/artist/:path*",
        "/genre/:path*",
        "/playlist/:path*",
        "/account",
    ]
}




