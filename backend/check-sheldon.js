const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/disaster-ready').then(async () => {
    const user = await mongoose.connection.db.collection('users').findOne({ email: 'sheldonpatel98@gmail.com' });
    if (user) {
        console.log("Sheldon exists:", user.name, user.email, user.points);
    } else {
        console.log("Sheldon DOES NOT exist.");
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
