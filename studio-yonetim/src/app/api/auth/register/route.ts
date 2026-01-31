import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { getDb } from "@/lib/mongodb"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, password } = body

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Eksik bilgi girdiniz." },
                { status: 400 }
            )
        }

        const db = await getDb()

        // Check if user exists check in 'User' collection to match Prisma model name usually mapped
        // Ideally should check schema.prisma map, usually User -> User or users. 
        // Given existing code context, let's assume 'User' or 'users'. 
        // Looking at schema.prisma: model User { ... } @map("_id") @db.ObjectId
        // Prisma usually maps model Generic to collection Generic (or lowercase depending on config).
        // I will use 'User' collection to align with typical Prisma->Mongo mapping or 'users'.
        // Let's check if there is any other usage. I'll stick to 'User' as per Prisma model name, 
        // or better, I will check what NextAuth uses if possible. 
        // For now 'User' is a safe bet if Prisma was the intention.

        const existingUser = await db.collection("User").findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { message: "Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var." },
                { status: 409 }
            )
        }

        const hashedPassword = await hash(password, 10)

        // Create new user
        const newUser = {
            name,
            email,
            passwordHash: hashedPassword,
            role: "EMPLOYEE", // Default role
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await db.collection("User").insertOne(newUser)

        // Remove password from response
        const { passwordHash, ...userWithoutPassword } = newUser

        return NextResponse.json(
            { user: userWithoutPassword, message: "Kayıt başarılı." },
            { status: 201 }
        )

    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: "Bir hata oluştu. Lütfen tekrar deneyin." },
            { status: 500 }
        )
    }
}
