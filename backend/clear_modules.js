const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    await db.collection('disastermodules').deleteMany({});
    console.log("Deleted all disaster modules. Seed data will regenerate them on next server boot.");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
