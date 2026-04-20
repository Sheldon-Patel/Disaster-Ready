const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function debug() {
    await mongoose.connect(process.env.MONGODB_URI);
    const UserProgress = mongoose.model('UserProgress', new mongoose.Schema({
        moduleId: mongoose.Schema.Types.ObjectId,
        status: String
    }));
    const DisasterModule = mongoose.model('DisasterModule', new mongoose.Schema({
        title: String
    }));

    const completionCounts = await UserProgress.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$moduleId', count: { $sum: 1 } } }
    ]);

    console.log('--- Aggregation Result ---');
    console.log(JSON.stringify(completionCounts, null, 2));

    const modules = await DisasterModule.find({}).limit(5);
    console.log('--- Modules IDs ---');
    modules.forEach(m => console.log(`${m.title}: ${m._id.toString()}`));

    await mongoose.disconnect();
    process.exit(0);
}

debug();
