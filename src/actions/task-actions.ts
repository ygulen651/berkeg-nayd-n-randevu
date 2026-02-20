"use server"

import { getDb, jsonify } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"

export async function createTask(formData: any) {
    try {
        const db = await getDb()
        const taskData = {
            ...formData,
            status: "TODO",
            createdAt: new Date(),
            updatedAt: new Date(),
            assignedTo: formData.assignedTo ? new ObjectId(formData.assignedTo) : null,
            shootId: formData.shootId ? new ObjectId(formData.shootId) : null,
        }

        const result = await db.collection("Task").insertOne(taskData)

        revalidatePath("/tasks")
        revalidatePath("/dashboard")

        return jsonify({
            success: true,
            task: { ...taskData, id: result.insertedId.toString() }
        })
    } catch (error: any) {
        console.error("Task creation error:", error)
        return { success: false, error: error.message }
    }
}

export async function getTasks() {
    try {
        const db = await getDb()
        const tasks = await db.collection("Task").aggregate([
            {
                $lookup: {
                    from: "User",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assigneeInfo"
                }
            },
            {
                $unwind: {
                    path: "$assigneeInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "Shoot",
                    localField: "shootId",
                    foreignField: "_id",
                    as: "shootInfo"
                }
            },
            {
                $unwind: {
                    path: "$shootInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]).toArray()

        const serialized = tasks.map(t => ({
            ...t,
            id: t._id.toString(),
            _id: t._id.toString(),
            assignee: t.assigneeInfo ? {
                ...t.assigneeInfo,
                id: t.assigneeInfo._id.toString(),
                _id: t.assigneeInfo._id.toString(),
            } : null,
            shoot: t.shootInfo ? {
                ...t.shootInfo,
                id: t.shootInfo._id.toString(),
                _id: t.shootInfo._id.toString(),
            } : null
        }))
        return jsonify(serialized)
    } catch (error) {
        console.error("Get tasks error:", error)
        return []
    }
}
export async function deleteTask(taskId: string) {
    try {
        const db = await getDb()
        await db.collection("Task").deleteOne({ _id: new ObjectId(taskId) })

        revalidatePath("/tasks")
        revalidatePath("/dashboard")

        return { success: true }
    } catch (error: any) {
        console.error("Task deletion error:", error)
        return { success: false, error: error.message }
    }
}
