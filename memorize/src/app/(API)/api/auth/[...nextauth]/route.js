// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) throw new Error('이메일이 존재하지 않습니다.')

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error('비밀번호가 일치하지 않습니다.')

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt',
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60
   },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
            token.id = user.id
            token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.name = token.name
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
