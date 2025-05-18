

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',                      // Homepage
  '/sign-in(.*)',
  '/sign-up(.*)',           // Add sign-up
  '/api/webhooks/clerk',
  '/guides(.*)',
  '/centers(.*)',
  '/leaderboard',          
  // Add other public pages like /guides, /api/webhooks/clerk, etc.
]);

 const isProtectedRoute = createRouteMatcher([
   '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/overview', req.url));
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}