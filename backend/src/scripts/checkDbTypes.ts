import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import UserProgress from '../models/UserProgress';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkTypes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        const sample = await UserProgress.findOne();
        if (!sample) {
            console.log('No progress records found');
            process.exit(0);
        }

        console.log('Sample UserProgress:', sample);
        console.log('Type of userId:', typeof sample.userId, sample.userId instanceof mongoose.Types.ObjectId ? '(ObjectId)' : '(Literal)');
        console.log('Type of moduleId:', typeof sample.moduleId, sample.moduleId instanceof mongoose.Types.ObjectId ? '(ObjectId)' : '(Literal)');

        // Check multiple records
        const records = await UserProgress.find().limit(10);
        records.forEach((r, i) => {
            console.log(`Record ${i}: userId type: ${r.userId instanceof mongoose.Types.ObjectId ? 'ObjectId' : 'Other'}, value: ${r.userId}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTypes();
