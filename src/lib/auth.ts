import type { NextAuthOptions } from "next-auth"
import prisma from "./db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
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
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const { email, password } = credentials

        const existingUser = await prisma.user.findUnique({
          where: { email },
        })

        if (!existingUser) {
          throw new Error("User not found")
        }

        if (!existingUser.hashedPassword) {
          throw new Error("Please log in with your social account")
        }

        const passwordMatched = await bcrypt.compare(password, existingUser.hashedPassword)

        if (!passwordMatched) {
          throw new Error("Invalid password")
        }

        await prisma.user.update({
          where: { email: email },
          data: { lastLogin: new Date() },
        })

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
          role: existingUser.role,
          profileAvatar: existingUser.profileAvatar || null, // Add this line
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger, account }) {
      if (user) {
        const sanitizedUsername = user.name ? user.name.replace(/\s+/g, "") : user.name
        return {
          ...token,
          id: user.id,
          name: sanitizedUsername,
          image: user.image,
          role: user.role,
          profileAvatar: user.profileAvatar, // Add this line
          rememberMe: session?.rememberMe || false,
        }
      }
      if (trigger === "update") {
        if (session?.name) {
          token.name = session.name.replace(/\s+/g, "")
        } else if (session?.image) {
          token.image = session.image
        }
      }

      await prisma.user.update({
        where: { id: token.id as string },
        data: {
          name: token.name as string,
          image: token.image as string,
          lastLogin: new Date(),
        },
      })  
      if (account) {
        token.accessToken = account.access_token;
      }
      return token
    },

    async session({ session, token }: any) {
      session.user.id = token.id
      session.user.name = token.name
      session.user.image = token.image
      session.user.role = token.role
      session.user.profileAvatar = token.profileAvatar // Add this line
      if (token.rememberMe) {
        session.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      } else {
        session.expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 day (default)
      }
      session.accessToken = token.accessToken;
      return session
    },

    async signIn({account, profile }: any) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({ where: { email: profile.email } })

          if (!existingUser) {
            const formattedName = profile?.name?.replace(/\s+/g, "")

            await prisma.user.create({
              data: {
                email: profile.email,
                name: formattedName,
                image: profile.picture || profile.avatar_url,
                lastLogin: new Date(),
                gender: "-",
                profileAvatar: null, // Add this line if needed
              },
            })
          }
        }
        return true
      } catch (error: any) {
        console.error("Error signing in with provider:", account?.provider, "Error message:", error.message)
        return false
      }
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
}

export default authOptions

