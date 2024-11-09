import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
// require('dotenv').config();

// const BASE_URL = "https://coursex.souryax.tech";
// const BASE_URL = "http://localhost:3000";
// const BASE_URL = process.env.BASE_URL as string;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   const forcedBaseUrl = BASE_URL;
    //   if (url.startsWith("/")) return `${forcedBaseUrl}${url}`
    //   else if (new URL(url).origin === forcedBaseUrl) return url
    //   return forcedBaseUrl
    // }
  },
  providers: [Google],
});