// middleware.js
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk',
  '/guides(.*)',
  '/centers(.*)',
  '/leaderboard',
]);

export default clerkMiddleware((auth, req) => { // 'auth' here is from clerkMiddleware
  console.log(`[MW] Request URL: ${req.nextUrl.pathname}`);
  console.log(`[MW] Auth state from clerkMiddleware (BEFORE protect): userId=${auth.userId}, isPublicPage=${isPublicRoute(req)}`);

  // If it's a public route
  if (isPublicRoute(req)) {
    if (auth.userId && (req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up'))) {
      console.log(`[MW] User (${auth.userId}) on auth page. Redirecting to /overview.`);
      return NextResponse.redirect(new URL('/overview', req.url));
    }
    console.log(`[MW] Public route ${req.nextUrl.pathname}. Allowing access.`);
    return NextResponse.next();
  }

  // If it's not a public route, user must be authenticated.
  // Let's see what auth.protect() does.
  console.log(`[MW] Protected route ${req.nextUrl.pathname}. Calling auth.protect(). Current userId is ${auth.userId}.`);
  try {
    const protectResponse = auth.protect(); // Call protect()

    // If auth.protect() decides to redirect, it might return a Response object or throw a special error.
    // If it returns a Response, we should return that.
    if (protectResponse instanceof Response) {
        console.log(`[MW] auth.protect() returned a Response object for ${req.nextUrl.pathname}. Assuming redirect.`);
        return protectResponse;
    }

    // If it didn't return a Response and didn't throw, it means it allowed access.
    console.log(`[MW] auth.protect() allowed access for ${req.nextUrl.pathname}. Auth state AFTER protect: userId=${auth.userId}`);
    return NextResponse.next();

  } catch (error) {
    // This catch block is important if protect() throws an error to signify a redirect
    console.error(`[MW] auth.protect() threw an error for ${req.nextUrl.pathname}:`, error.message);
    // It's possible Clerk's protect() throws an error that is meant to be handled by Next.js to perform the redirect.
    // In such cases, re-throwing might be appropriate, or checking the error type.
    // For now, let's assume if it throws, the redirect is being handled.
    // If the error is NOT a redirect error, then we have a different problem.
    // Clerk's protect() often throws a special error when it wants to redirect.
    // If an error is caught, we might not want to proceed with NextResponse.next().
    // Let's see what kind of error it is. If it's a redirect, we might not need to return anything here.
    // This part is tricky as `protect()` behavior can be subtle.
    // If it throws, let the default clerkMiddleware behavior handle it.
    // We might not need to explicitly return here if the error itself triggers the redirect.
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};