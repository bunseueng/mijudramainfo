import { NextAuthOptions } from "next-auth";
import prisma from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
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
      allowDangerousEmailAccountLinking: true
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials", 
      credentials: {
      email: { label: "Email", type: "email", placeholder: "name@mail.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if(!credentials?.email || !credentials?.password) {
        return null
      }

      const {email, password} = credentials

      const existingUser = await prisma.user.findUnique({
        where: { email}
      })

      if(!existingUser) {
        return null
      }

      await prisma.user.update({
        where: {
          email: email
        },
        data:{
          lastLogin: new Date()
        }
      })

      const passwordMatched = await bcrypt.compare(password, existingUser.hashedPassword!)
  
      if(!passwordMatched) {
        return null
      }

      return existingUser
      
    }
  })
  ],
  callbacks: {
    async jwt({token, user, session, trigger}) {

      if(user) {
        const sanitizedUsername = user.name ? user.name.replace(/\s+/g, '') : user.name;
        return {
          ...token,
          id: user.id,
          name:sanitizedUsername,
          image: user.image,
          role: user.role,
          rememberMe: session?.rememberMe || false,
        }
      }
        if(trigger === "update") {
          if(session?.name) {
            token.name = session.name.replace(/\s+/g, '');
          } else if (session?.image) {
            token.image = session.image
          }
            console.log("User updated successfully")
        } 

        await prisma.user.update({
          where: { id: token.id as string },
          data: {
            name: token.name as string,
            image: token.image as string,
            lastLogin: new Date()
          }
        });
      return token
  },

    async session({ session, token }: any) {
      // Avoid database lookup if token already has user info
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.role = token.role;
      if (token.rememberMe) {
        session.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      } else {
        session.expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 1 day (default)
      }
      return session;
    },
  
    async signIn({ account, profile }: any) {
      try {
        if (account?.provider === "google") {
          console.log("Google Provider Sign In:", profile.email);
    
          const existingUser = await prisma.user.findUnique({ where: { email: profile.email } });
    
          if (existingUser) {
            console.log("User exists:", profile.email);
          } else {
            const formattedName = profile?.name?.replace(/\s+/g, "");
    
            await prisma.user.create({
              data: {
                email: profile.email,
                name: formattedName,
                image: profile.picture || profile.avatar_url,
                lastLogin: new Date(),
                gender: "-",
              },
            });
            console.log("New user created:", profile.email);
          }
        }
    
        return true;
      } catch (error: any) {
        console.error("Error signing in with provider:", account?.provider, "Error message:", error.message);
        return false;
      }
    },  
    
    async redirect({ baseUrl }) { return baseUrl },
  }
}