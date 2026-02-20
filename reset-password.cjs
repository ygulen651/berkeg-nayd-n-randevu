const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://ygulen651_db_user:UHiDDW61TVbPmsmW@cluster0.jtn56ql.mongodb.net/studio_db?appName=Cluster0";
const email = "ygulen651@gmail.com";
const newPassword = "newpassword123"; // İstediğiniz şifreyi buraya yazabilirsiniz

async function resetPassword() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('studio_db');

        console.log(`Hashing new password for ${email}...`);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await db.collection("User").updateOne(
            { email },
            { $set: { passwordHash: hashedPassword, updatedAt: new Date() } }
        );

        if (result.modifiedCount > 0) {
            console.log("Password successfully updated!");
            console.log(`New password is: ${newPassword}`);
        } else {
            console.log("User not found or password was already that value.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

resetPassword();
