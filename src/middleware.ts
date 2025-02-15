import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in',
    '/api/check-subdomain(.*)',
    '/api/create-subdomain(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth()

    // Allow public API routes to bypass auth
    if (isPublicRoute(req)) {
        return;
    }

    // Protect everything else except static files (handled by matcher)
    if (!userId) {
        return redirectToSignIn();
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
}