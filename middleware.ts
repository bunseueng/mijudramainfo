import { getToken } from 'next-auth/jwt';
import type { JWT } from "next-auth/jwt"
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    // Get the pathname
    const path = request.nextUrl.pathname;

    // Allow GET requests to pass through without authentication
    if (request.method === 'GET') {
        return NextResponse.next();
    }

    try {
        // Check authentication for POST, PUT, PATCH, DELETE methods
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        }) as JWT | null;

        if (!token) {
            return new NextResponse(
                JSON.stringify({ error: 'Authentication required' }),
                { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export const config = {
    matcher: [
        '/api/approve-paypal', 
        '/api/coverphoto', 
        '/api/create-order', 
        '/api/favorite/:path*', 
        '/api/feeds/:path*', 
        '/api/follow/:path*', 
        '/api/friend/:path*', 
        '/api/list/:path*', 
        '/api/metadata', 
        '/api/movie/:path*', 
        '/api/paypal', 
        '/api/person/:path*', 
        '/api/setting/:path*', 
        '/api/stripe', 
        '/api/tv/:path*'
    ],
};