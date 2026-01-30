"use server"

import { getDb, jsonify } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"

export async function createShoot(formData: any) {
    try {
        const db = await getDb()
        const shootData = {
            ...formData,
            status: "PLANNED",
            createdAt: new Date(),
            updatedAt: new Date(),
            customerId: new ObjectId(formData.customerId)
        }

        const result = await db.collection("Shoot").insertOne(shootData)

        revalidatePath("/calendar")
        revalidatePath("/shoots")
        revalidatePath("/dashboard")

        return jsonify({
            success: true,
            shoot: { ...shootData, id: result.insertedId.toString() }
        })
    } catch (error: any) {
        console.error("Shoot creation error:", error)
        return { success: false, error: error.message }
    }
}

export async function getShoots() {
    try {
        const db = await getDb()
        const shoots = await db.collection("Shoot").aggregate([
            {
                $lookup: {
                    from: "Customer",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerInfo"
                }
            },
            {
                $unwind: {
                    path: "$customerInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    startDateTime: 1
                }
            }
        ]).toArray()

        const serialized = shoots.map(s => ({
            ...s,
            id: s._id.toString(),
            _id: s._id.toString(),
            customer: s.customerInfo ? {
                ...s.customerInfo,
                id: s.customerInfo._id.toString(),
                _id: s.customerInfo._id.toString(),
            } : null
        }))
        return jsonify(serialized)
    } catch (error) {
        console.error("Get shoots error:", error)
        return []
    }
}
