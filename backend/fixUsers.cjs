const { MongoClient } = require('mongodb');
const uri = "mongodb";

async function fixUsers() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('disaster-ready');
        const users = db.collection('users');

        // Replace "Punjab Admin" with "India Admin" in user schools
        await users.updateMany(
            { school: "Punjab Admin" },
            { $set: { school: "India Admin" } }
        );
        // Replace "Punjab Public School" with "India Public School" 
        await users.updateMany(
            { school: "Punjab Public School" },
            { $set: { school: "India Public School" } }
        );
        console.log("✅ User schools updated from Punjab to India.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
fixUsers();
