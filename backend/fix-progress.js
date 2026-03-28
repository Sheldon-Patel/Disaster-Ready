const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin123:admin123@cluster0.bpby1cf.mongodb.net/disaster-ready?retryWrites=true&w=majority&appName=Cluster0';

async function fixProgress() {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Find User
        const user = await mongoose.connection.db.collection('users').findOne({ email: 'sheldonpatel98@gmail.com' });
        if (!user) throw new Error('User not found');

        // Find current modules
        const eqModule = await mongoose.connection.db.collection('disastermodules').findOne({ title: 'Earthquake Preparedness' });
        const floodModule = await mongoose.connection.db.collection('disastermodules').findOne({ title: 'Flood Safety' });

        if (eqModule) {
            await mongoose.connection.db.collection('userprogresses').updateOne(
                { userId: String(user._id), moduleId: String(eqModule._id) },
                {
                    $set: {
                        status: 'completed',
                        score: 100,
                        completedAt: new Date(),
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
            // Increment completions
            await mongoose.connection.db.collection('disastermodules').updateOne(
                { _id: eqModule._id },
                { $inc: { completions: 1 } }
            );
            console.log('Fixed Earthquake Progress');
        }

        if (floodModule) {
            await mongoose.connection.db.collection('userprogresses').updateOne(
                { userId: String(user._id), moduleId: String(floodModule._id) },
                {
                    $set: {
                        status: 'completed',
                        score: 80,
                        completedAt: new Date(),
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
            await mongoose.connection.db.collection('disastermodules').updateOne(
                { _id: floodModule._id },
                { $inc: { completions: 1 } }
            );
            console.log('Fixed Flood Progress');
        }

        await mongoose.disconnect();
        console.log('Done');
    } catch (error) {
        console.error(error);
    }
}

fixProgress();
