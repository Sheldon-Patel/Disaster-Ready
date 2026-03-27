const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const restoreProgress = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("Missing MONGODB_URI");

        await mongoose.connect(uri);
        console.log('MongoDB Connected');
        const db = mongoose.connection.db;

        // 1. Get user
        const user = await db.collection('users').findOne({ email: 'sheldonpatel98@gmail.com' });
        if (!user) {
            console.log('User not found!');
            process.exit(1);
        }

        // 2. Get all badges and modules
        const badges = await db.collection('badges').find({}).toArray();
        const modules = await db.collection('disastermodules').find({}).toArray();

        // 3. Update user points and badges
        const badgeIds = badges.map(b => b._id);
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { badges: badgeIds, points: 5000 } }
        );
        console.log(`Earned ${badgeIds.length} badges and 5000 points.`);

        // 4. Create UserProgress for all modules
        await db.collection('userprogresses').deleteMany({ userId: user._id });
        const progressDocs = modules.map(m => ({
            userId: user._id,
            moduleId: m._id,
            status: 'completed',
            score: 100,
            completedAt: new Date(Date.now() - 86400000), // 1 day ago
            lastAccessed: new Date(),
            createdAt: new Date(Date.now() - 86400000 * 2),
            updatedAt: new Date()
        }));

        if (progressDocs.length > 0) {
            await db.collection('userprogresses').insertMany(progressDocs);
            console.log(`Restored 100% progress for ${progressDocs.length} modules.`);
        } else {
            console.log('No modules found in DB to restore progress for.');
        }

        // 5. Create a DrillSession
        await db.collection('drillsessions').deleteMany({ userId: user._id });
        const drillDoc = {
            userId: user._id,
            drillType: 'earthquake',
            status: 'completed',
            score: 95,
            completionTime: 45,
            timeline: [
                { action: 'start', timestamp: new Date(Date.now() - 3600000 * 5) },
                { action: 'drop', timestamp: new Date(Date.now() - 3600000 * 5 + 2000) },
                { action: 'cover', timestamp: new Date(Date.now() - 3600000 * 5 + 5000) },
                { action: 'hold_on', timestamp: new Date(Date.now() - 3600000 * 5 + 15000) },
                { action: 'evacuate', timestamp: new Date(Date.now() - 3600000 * 5 + 40000) },
                { action: 'complete', timestamp: new Date(Date.now() - 3600000 * 5 + 45000) }
            ],
            createdAt: new Date(Date.now() - 3600000 * 5),
            updatedAt: new Date(Date.now() - 3600000 * 5 + 45000)
        };
        await db.collection('drillsessions').insertOne(drillDoc);
        console.log('Restored drill session history.');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit(0);
    }
};

restoreProgress();
