const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb+srv://admin123:admin123@cluster0.bpby1cf.mongodb.net/disaster-ready?retryWrites=true&w=majority&appName=Cluster0');
    const User = mongoose.connection.collection('users');

    const teacher = await User.findOne({ role: 'teacher' });
    const admin = await User.findOne({ role: 'admin' });

    console.log('Teacher:', teacher ? teacher.email : 'None');
    console.log('Admin:', admin ? admin.email : 'None');

    process.exit(0);
}

test();
