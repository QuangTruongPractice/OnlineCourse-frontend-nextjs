import { withAuth } from "next-auth/middleware";
import type { NextFetchEvent, NextRequest } from 'next/server';
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
import { getServerSession, JWT } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/route";

// export async function middleware(request: NextRequest) {


//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.redirect('/login');
//     }

//     const { pathname } = request.nextUrl;

//     // Get employee ID from path 
//     const pathParts = pathname.split('/');
//     const employeeId = pathParts[pathParts.length - 1];

//     // Validate employee ID 
//     if (!employeeId.match(/^\d+$/)) {
//         return NextResponse.redirect('/invalid-employee');
//     }

//     return NextResponse.next();

// }



export default withAuth(
    function middleware(req) {

        const { pathname } = req.nextUrl;

        const res = req.nextauth.token;
        // Ví dụ: chỉ admin mới được upload track
        //@ts-ignore    
        if (pathname.startsWith(`/utils/${4}`) && res.role.includes(process.env.NEXT_PUBLIC_VIP1ID)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Default: Cho qua
        return NextResponse.next();
    },
    {
        pages: {
            signIn: '/auth/signin',
        },
    }
);

export const config = {
    matcher: ["/track/upload"],
};