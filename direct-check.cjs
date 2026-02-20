const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ygulen651_db_user:UHiDDW61TVbPmsmW@cluster0.jtn56ql.mongodb.net/studio_db?appName=Cluster0";

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('studio_db');
        const email = "ygulen651@gmail.com";

        console.log("Checking User collection...");
        const user = await db.collection("User").findOne({ email });
        if (user) {
            console.log("User found in 'User':", JSON.stringify({ ...user, passwordHash: user.passwordHash || "MISSING" }, null, 2));
        } else {
            console.log("User NOT found in 'User'.");
        }

        console.log("Checking users collection...");
        const user2 = await db.collection("users").findOne({ email });
        if (user2) {
            console.log("User found in 'users':", JSON.stringify({ ...user2, passwordHash: user2.passwordHash ? "[HIDDEN]" : "MISSING" }, null, 2));
        } else {
            console.log("User NOT found in 'users'.");
        }

    } finally {
        await client.close();
    }
}
run().catch(console.dir);
