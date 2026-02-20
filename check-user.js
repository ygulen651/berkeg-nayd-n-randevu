import { getDb } from "./src/lib/mongodb.js";
import dotenv from "dotenv";
dotenv.config();

async function checkUser() {
    try {
        const db = await getDb();
        const email = "ygulen651@gmail.com";
        const user = await db.collection("User").findOne({ email });

        if (user) {
            console.log("User found:");
            console.log(JSON.stringify(user, null, 2));
            console.log("Has passwordHash:", !!user.passwordHash);
        } else {
            console.log("User not found in 'User' collection.");
            // Check 'users' collection just in case
            const user2 = await db.collection("users").findOne({ email });
            if (user2) {
                console.log("Found in 'users' collection instead!");
            }
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

checkUser();
