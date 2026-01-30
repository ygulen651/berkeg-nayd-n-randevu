import NextAuth from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface User {
        role?: Role | string
        id?: string
    }
    interface Session {
        user: {
            id: string
            role: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        id?: string
    }
}
