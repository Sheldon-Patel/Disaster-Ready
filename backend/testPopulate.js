const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function testPopulate() {
    await mongoose.connect(process.env.MONGODB_URI);

    const userId = '69c2d7a38e1d585c0e933345'; // Sheldon

    try {
        const User = mongoose.connection.model('User', new mongoose.Schema({
            badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }]
        }, { collection: 'users' }));

        const Badge = mongoose.connection.model('Badge', new mongoose.Schema({
            name: String,
            points: Number
        }, { collection: 'badges' }));

        const user = await User.findById(userId).populate('badges');
        console.log('Populated Badges count:', user.badges.length);
        console.log('Sample populated badge:', typeof user.badges[0] === 'object' ? user.badges[0].name : 'STILL A STRING!');
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testPopulate();
