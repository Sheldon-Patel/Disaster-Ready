const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function findOrphans() {
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        const UserProgress = mongoose.connection.collection('userprogresses');
        const User = mongoose.connection.collection('users');

        const progresses = await UserProgress.find({}).toArray();
        const userIds = [...new Set(progresses.map(p => p.userId))];

        console.log(`Checking ${userIds.length} unique user IDs from progress records...`);

        for (const uid of userIds) {
            let user;
            try {
                user = await User.findOne({ _id: new mongoose.Types.ObjectId(uid) });
            } catch (e) {
                // Ignore cast errors
            }
            if (!user) {
                console.log(`ORPHANED ID FOUND: ${uid}`);
                // See what they completed
                const theirProgress = progresses.filter(p => p.userId === uid);
                console.log(`This user has ${theirProgress.length} progress records.`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

findOrphans();
