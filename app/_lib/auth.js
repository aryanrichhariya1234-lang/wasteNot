import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_AUTH_CLIENT_ID,
      clientSecret: process.env.NEXT_AUTH_CLIENT_SECRET,
    }),
  ],
});
