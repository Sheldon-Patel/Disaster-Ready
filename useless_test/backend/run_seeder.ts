import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedAllModules } from './src/services/seedData';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to DB, running seeder...');
        await seedAllModules();
        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

run();
