// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"; // Corrected import

const isPublicRoute = createRouteMatcher([
  '/', // Allow homepage
  '/sign-in(.*)', // Allow sign-in and its sub-routes
  '/sign-up(.*)', // Allow sign-up and its sub-routes
  '/api/webhooks/clerk', // Allow Clerk webhook
  '/guides', // Allow viewing guides
  '/guides/(.*)', // Allow viewing individual guides
  '/centers', // Allow viewing recycling centers
  '/leaderboard' // Allow viewing leaderboard
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return; // Do not protect public routes
  }
  // For all other routes, protect them
  auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};