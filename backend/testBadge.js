const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function testBadge() {
    await mongoose.connect(process.env.MONGODB_URI);

    const userId = '69c2d7a38e1d585c0e933345'; // Sheldon
    const UserProgress = mongoose.connection.collection('userprogresses');

    try {
        const progresses = await UserProgress.find({ userId, status: 'completed' }).toArray();
        console.log(`COMPLETED MODULES FOR SHELDON: ${progresses.length}`);

        const Badge = mongoose.connection.collection('badges');
        const firstSteps = await Badge.findOne({ name: 'First Steps' });
        console.log('First steps badge:', firstSteps?._id);

        const User = mongoose.connection.collection('users');
        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
        console.log('Sheldon badges before:', user.badges);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testBadge();
