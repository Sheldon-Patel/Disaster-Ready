const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb+srv://admin123:admin123@cluster0.bpby1cf.mongodb.net/disaster-ready?retryWrites=true&w=majority&appName=Cluster0');
    const User = mongoose.connection.collection('users');

    const sheldon = await User.findOne({ email: 'sheldonpatel98@gmail.com' });
    console.log('Sheldon:', { email: sheldon.email, role: sheldon.role, school: sheldon.school, grade: sheldon.grade, profile: sheldon.profile });

    process.exit(0);
}

test();
