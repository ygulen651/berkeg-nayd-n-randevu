"use server"

import { getDb, jsonify } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"

export async function createCustomer(formData: any) {
    try {
        const db = await getDb()
        const customer = {
            ...formData,
            createdAt: new Date(),
        }

        const result = await db.collection("Customer").insertOne(customer)

        revalidatePath("/")
        revalidatePath("/customers")
        revalidatePath("/shoots")
        revalidatePath("/calendar")
        revalidatePath("/finance")
        revalidatePath("/dashboard")
        return jsonify({
            success: true,
            customer: {
                ...customer,
                id: result.insertedId.toString()
            }
        })
    } catch (error: any) {
        console.error("Customer creation error:", error)
        return { success: false, error: error.message }
    }
}

export async function getCustomers(searchQuery?: string) {
    try {
        const db = await getDb()
        let query = {}
        if (searchQuery) {
            query = {
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { phone: { $regex: searchQuery, $options: "i" } },
                    { email: { $regex: searchQuery, $options: "i" } },
                ]
            }
        }
        const customers = await db.collection("Customer").find(query).sort({ createdAt: -1 }).toArray()

        const serialized = customers.map(c => ({
            ...c,
            id: c._id.toString(),
            _id: c._id.toString()
        }))
        return jsonify(serialized)
    } catch (error) {
        console.error("Get customers error:", error)
        return []
    }
}
export async function deleteCustomer(customerId: string) {
    try {
        const db = await getDb()
        await db.collection("Customer").deleteOne({ _id: new ObjectId(customerId) })

        revalidatePath("/")
        revalidatePath("/customers")
        revalidatePath("/shoots")
        revalidatePath("/calendar")
        revalidatePath("/finance")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error: any) {
        console.error("Customer deletion error:", error)
        return { success: false, error: error.message }
    }
}
