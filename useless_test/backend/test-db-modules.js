const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    try {
        const modules = await mongoose.connection.collection('disastermodules').find({}).toArray();
        console.log('Modules in DB:');
        modules.forEach(m => console.log(`- ${m.title} (${m.type}) ID: ${m._id}`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
