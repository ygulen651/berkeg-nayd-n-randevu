"use server"

import { getDb, jsonify } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export async function createEmployee(formData: any) {
    try {
        const db = await getDb()

        // Otomatik geçici şifre oluştur (veya formData.password varsa onu kullan)
        const password = formData.password || "berke123"
        const passwordHash = await bcrypt.hash(password, 10)
        const userId = new ObjectId()

        const userData = {
            _id: userId,
            email: formData.email,
            passwordHash,
            name: formData.name,
            role: formData.role,
            phone: formData.phone, // Telefon bilgisini ekle
            createdAt: new Date(),
        }

        await db.collection("User").insertOne(userData)

        const employeeData = {
            userId: userId,
            position: formData.position,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await db.collection("Employee").insertOne(employeeData)

        revalidatePath("/employees")
        return jsonify({
            success: true,
            user: { ...userData, id: userId.toString() },
            temporaryPassword: password
        })
    } catch (error: any) {
        console.error("Employee creation error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteEmployee(userId: string) {
    try {
        const db = await getDb()
        const userOID = new ObjectId(userId)

        // Hem User hem Employee koleksiyonundan sil
        await db.collection("User").deleteOne({ _id: userOID })
        await db.collection("Employee").deleteOne({ userId: userOID })

        revalidatePath("/employees")
        return { success: true }
    } catch (error: any) {
        console.error("Employee deletion error:", error)
        return { success: false, error: error.message }
    }
}

export async function getEmployees() {
    try {
        const db = await getDb()
        const employees = await db.collection("User").aggregate([
            {
                $match: {
                    role: { $in: ["ADMIN", "EMPLOYEE"] }
                }
            },
            {
                $lookup: {
                    from: "Employee",
                    localField: "_id",
                    foreignField: "userId",
                    as: "employeeInfo"
                }
            },
            {
                $unwind: {
                    path: "$employeeInfo",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).toArray()

        const serialized = employees.map(u => ({
            ...u,
            id: u._id.toString(),
            _id: u._id.toString(),
            employee: u.employeeInfo ? {
                ...u.employeeInfo,
                id: u.employeeInfo._id.toString(),
                _id: u.employeeInfo._id.toString(),
            } : null
        }))
        return jsonify(serialized)
    } catch (error) {
        console.error("Get employees error:", error)
        return []
    }
}

export async function changeEmployeeRole(userId: string, newRole: "ADMIN" | "EMPLOYEE") {
    try {
        const db = await getDb()
        await db.collection("User").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { role: newRole, updatedAt: new Date() } }
        )
        revalidatePath("/employees")
        return { success: true }
    } catch (error: any) {
        console.error("Change role error:", error)
        return { success: false, error: error.message }
    }
}

