const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

async function restoreUser() {
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        const User = mongoose.connection.collection('users');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('student1', salt);

        await User.insertOne({
            _id: new mongoose.Types.ObjectId('69c2d7a38e1d585c0e933345'),
            name: 'Sheldon Patel',
            email: 'student1@school.in',
            password: hashedPassword,
            role: 'student',
            school: 'STA School',
            grade: 10,
            points: 500,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('Restored Sheldon Patel account successfully!');
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

restoreUser();
