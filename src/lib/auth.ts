import { NextAuthOptions } from "next-auth";
import prisma from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session }: any) {
      const sessionUser = await prisma.user.findUnique({ where: { email: session.user.email } })

      session.user.id = sessionUser?.id
      return session
    },
    async signIn({ account, profile, user }: any) {
      try {
        const existingUser = await prisma.user.findUnique({ where: { email: profile.email } })

        const formattedName = profile?.name?.replace(/\s+/g, "");
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: profile.email,
              name: formattedName,
              image: profile.picture || profile.avatar_url,
              lastLogin: new Date(),
              gender: "-"
            }
          })
        } else {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { lastLogin: new Date() }
          })
        }
        return true
      } catch (error) {
        return false
      }
    }
  }
}