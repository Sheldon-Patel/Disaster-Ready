import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const restoreUser = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("Missing MONGODB_URI");

        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        const db = mongoose.connection.db;
        if (!db) throw new Error("Database connection not established");
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // 1. Drop the punjabalerts collection
        if (collectionNames.includes('punjabalerts')) {
            await db.dropCollection('punjabalerts');
            console.log('Successfully deleted the punjabalerts collection.');
        } else {
            console.log('Collection punjabalerts does not exist.');
        }

        // 2. Recreate sheldonpatel98@gmail.com
        await User.deleteMany({ email: 'sheldonpatel98@gmail.com' }); // Ensure clean slate

        const newUser = new User({
            name: 'Sheldon Patel',
            email: 'sheldonpatel98@gmail.com',
            password: 'sheldon@123',
            role: 'student',
            school: 'Demo School',
            district: 'Demo District',
            points: 100
        });

        await newUser.save();
        console.log('Successfully recreated Sheldon Patel account.');

    } catch (error) {
        console.error('Error in restore script:', error);
    } finally {
        process.exit(0);
    }
};

restoreUser();
