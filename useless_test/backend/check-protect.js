require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    require('./src/models/User');
    require('./src/models/UserProgress');
    require('./src/models/Badge');
    const User = mongoose.model('User');

    const token = jwt.sign({ id: '69c5749736c0b17dc937fa9e', email: 'sheldonpatel98@gmail.com', role: 'student' }, process.env.JWT_SECRET || 'default_secret');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        console.log("Decoded:", decoded.id);

        const user = await User.findById(decoded.id).select('-password');
        console.log("User:", user.email);

        user.lastLogin = new Date();
        await user.save();
        console.log("Saved user!");

        // Now simulate getProfile
        const profile = await User.findById(decoded.id)
            .populate('badges')
            .populate('completedModulesCount');
        console.log("Profile modules count:", profile.completedModulesCount);

    } catch (e) {
        console.error("Test error:", e);
    }
    process.exit(0);
}

test();
