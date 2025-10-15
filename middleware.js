import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
  // 1. Create a single response object that we can modify
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Create the Supabase client configured to handle cookies on the single response object
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // Set the cookie on the single response object
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          // Remove the cookie from the single response object
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // 3. Refresh the session token. This is the most important step for Auth Helpers.
  const {
    data: { user },
  } = await supabase.auth.getSession();

  // 4. Handle redirects based on authentication status.
  //   const protectedPaths = ["/dashboard", "/profile"]; // Define your protected paths here
  //   const isProtectedPath = protectedPaths.some((path) =>
  //     request.nextUrl.pathname.startsWith(path)
  //   );

  const { pathname } = request.nextUrl;

  // Check if the user is not logged in AND they are not already on the login page
  //   if (pathname !== "/login") {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }

  // 5. Return the single, final response object
  return response;
}

// 6. Define which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to customize this based on your needs.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
