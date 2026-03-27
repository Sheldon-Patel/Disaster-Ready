const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mapping = {
    '1': 'Earthquake Preparedness',
    '2': 'Flood Safety',
    '3': 'Fire Safety',
    '4': 'Cyclone Preparedness',
    '5': 'Drought Preparedness',
    '6': 'Heatwave Safety',
    'tornado-101': 'Tornado Safety Guide',
    'gas-leak-101': 'Gas Leak Response',
    'building-collapse-101': 'Building Collapse Survival'
};

async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    try {
        const modules = await mongoose.connection.collection('disastermodules').find({}).toArray();
        const moduleMap = {};
        for (const m of modules) {
            moduleMap[m.title] = m._id.toString();
        }

        const UserProgress = mongoose.connection.collection('userprogresses');

        let migratedCount = 0;
        for (const [oldId, title] of Object.entries(mapping)) {
            const newId = moduleMap[title];
            if (!newId) continue;

            const result = await UserProgress.updateMany(
                { moduleId: oldId },
                { $set: { moduleId: newId } }
            );
            if (result.modifiedCount > 0) {
                console.log(`Migrated ${result.modifiedCount} progress records from ${oldId} to ${title} (${newId})`);
                migratedCount += result.modifiedCount;
            }
        }

        console.log(`Total progress records migrated: ${migratedCount}`);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

migrate();
