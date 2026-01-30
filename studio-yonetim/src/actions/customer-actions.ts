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

        revalidatePath("/customers")
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

export async function getCustomers() {
    try {
        const db = await getDb()
        const customers = await db.collection("Customer").find({}).sort({ createdAt: -1 }).toArray()

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
