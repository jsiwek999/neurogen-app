// middleware.ts (v6 style)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Public routes (add any API endpoints you want public, too)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/api/ritual(.*)', // <-- keep public if your form calls this unauthenticated
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect everything that isn't public
  if (!isPublicRoute(req)) {
    await auth.protect(); // v6: note the *no parentheses* before .protect
  }

  // If you want a custom redirect instead of default:
  // const isProtected = !isPublicRoute(req);
  // if (isProtected) {
  //   const { userId, redirectToSignIn } = await auth();
  //   if (!userId) return redirectToSignIn({ returnBackUrl: req.nextUrl.href });
  // }
});

// Recommended matcher from Clerk docs
export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
