import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {prisma} from "@/lib/prisma";

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in',
    '/dashboard(.*)',
    '/api/check-subdomain(.*)',
    '/api/create-subdomain(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const { userId, redirectToSignIn } = await auth()
    const hostname = req.headers.get('host') || ''
    const subdomain = hostname.split('.')[0]
    const isSubdomainPage = subdomain !== 'www' && !subdomain.includes('localhost:');

    console.log({isSubdomainPage, subdomain, userId })

    // Only consider it a subdomain if it's not www or localhost
    if (isSubdomainPage) {
        const url = req.nextUrl.clone()
        url.pathname = `/p/${subdomain}${req.nextUrl.pathname}`
        return NextResponse.rewrite(url)
    }

    // Then check public routes
    if (isPublicRoute(req)) {
        return NextResponse.next()
    }

    // Finally protect all other routes
    if (!userId) {
        return redirectToSignIn()
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}