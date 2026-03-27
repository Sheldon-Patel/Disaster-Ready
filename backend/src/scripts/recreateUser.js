const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const restoreUser = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("Missing MONGODB_URI");

        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        if (collectionNames.includes('punjabalerts')) {
            await db.dropCollection('punjabalerts');
            console.log('Successfully deleted the punjabalerts collection.');
        } else {
            console.log('Collection punjabalerts does not exist.');
        }

        await db.collection('users').deleteMany({ email: 'sheldonpatel98@gmail.com' });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('sheldon@123', salt);

        await db.collection('users').insertOne({
            name: 'Sheldon Patel',
            email: 'sheldonpatel98@gmail.com',
            password: hashedPassword,
            role: 'student',
            school: 'Demo School',
            district: 'Demo District',
            points: 100,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('Successfully recreated Sheldon Patel account.');

    } catch (error) {
        console.error('Error in restore script:', error);
    } finally {
        process.exit(0);
    }
};

restoreUser();
