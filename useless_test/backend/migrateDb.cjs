const { MongoClient } = require('mongodb');
const uri = "mongodb";

async function runMigration() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ connected to MongoDB Atlas");

        const sourceDb = client.db('disaster-preparedness-punjab');
        const targetDb = client.db('disaster-ready');

        console.log("🧹 Dropping any existing data in the target database ('disaster-ready')...");
        await targetDb.dropDatabase();

        const collections = await sourceDb.listCollections().toArray();

        let allMatches = true;

        for (const col of collections) {
            if (col.type === 'view') continue;
            const colName = col.name;
            console.log(`\n📦 Starting migration for collection: ${colName}`);

            const sourceCol = sourceDb.collection(colName);
            const targetCol = targetDb.collection(colName);

            // Read all documents
            const docs = await sourceCol.find({}).toArray();
            if (docs.length > 0) {
                await targetCol.insertMany(docs);
            }
            console.log(`   - Copied ${docs.length} documents.`);

            // Copy Indexes
            try {
                const indexes = await sourceCol.listIndexes().toArray();
                for (const idx of indexes) {
                    if (idx.name !== '_id_') {
                        const options = { name: idx.name };
                        if (idx.unique !== undefined) options.unique = idx.unique;
                        if (idx.sparse !== undefined) options.sparse = idx.sparse;
                        if (idx.expireAfterSeconds !== undefined) options.expireAfterSeconds = idx.expireAfterSeconds;

                        await targetCol.createIndex(idx.key, options);
                        console.log(`   - Created index: ${idx.name}`);
                    }
                }
            } catch (err) {
                console.log(`   - Error copying indexes: ${err.message}`);
            }

            // Verify
            const sourceCount = await sourceCol.countDocuments();
            const targetCount = await targetCol.countDocuments();
            console.log(`   ✅ Verification: Source=${sourceCount}, Target=${targetCount}`);

            if (sourceCount !== targetCount) {
                allMatches = false;
                console.log("   ❌ WARNING: Count mismatch!");
            }
        }

        if (allMatches) {
            console.log("\n✅ All collections verified successfully.");
            console.log("🗑️ Safely dropping old database 'disaster-preparedness-punjab'...");
            try {
                await sourceDb.dropDatabase();
                console.log("✅ Old database dropped successfully!");
            } catch (e) {
                console.log("⚠️ Could not drop old database (permissions?): ", e.message);
            }
        } else {
            console.log("\n❌ Verification failed. Aborting drop of the old database.");
        }

    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await client.close();
        console.log("🔌 Connection closed.");
    }
}

runMigration();
