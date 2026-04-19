const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb+srv://admin123:admin123@cluster0.bpby1cf.mongodb.net/disaster-ready?retryWrites=true&w=majority&appName=Cluster0');

    const User = mongoose.connection.collection('users');

    const allUsers = await User.find({ role: 'student' }).toArray();
    console.log('Sample users school fields:', allUsers.slice(0, 2).map(u => ({ email: u.email, school: u.school, grade: u.grade })));

    const schoolUsers = await User.find({
        isActive: true,
        role: 'student',
        school: { $regex: 'Demo School', $options: 'i' }
    }).toArray();

    console.log("School users matched:", schoolUsers.length);

    process.exit(0);
}

test();
