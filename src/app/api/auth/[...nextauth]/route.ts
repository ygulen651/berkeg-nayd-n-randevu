import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getDb } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Şifre", type: "password" },
            },
            async authorize(credentials) {
                console.log("Authorize attempt for:", credentials?.email)
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials")
                    return null
                }

                const db = await getDb()
                const normalizedEmail = credentials.email.toLowerCase()
                const user = await db.collection("User").findOne({
                    email: { $regex: `^${normalizedEmail}$`, $options: "i" }
                })
                console.log("User found in DB:", !!user)

                if (!user || !user.passwordHash) {
                    console.log("User not found or no password hash")
                    return null
                }

                console.log("Comparing passwords...")
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                )
                console.log("Password valid:", isPasswordValid)

                if (!isPasswordValid) return null

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
