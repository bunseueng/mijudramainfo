import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    // Allow GET requests to pass through without authentication
    if (request.method === 'GET') {
        return NextResponse.next();
    }

    // Check authentication for POST, PUT, PATCH, DELETE methods
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        const response = NextResponse.json(
            { error: 'Invalid User' },
            { status: 401 }
        );

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/approve-paypal', 
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