const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const UserProgress = mongoose.connection.collection('userprogresses');
    const records = await UserProgress.find({}).toArray();
    console.log(`Found ${records.length} progress records.`);
    records.forEach(r => console.log(`- User: ${r.userId}, Module: ${r.moduleId}, Status: ${r.status}`));
    await mongoose.disconnect();
    process.exit(0);
}

check();
