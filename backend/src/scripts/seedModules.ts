import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedAllModules, seedBadges } from '../services/seedData';
import DisasterModule from '../models/DisasterModule';
import UserProgress from '../models/UserProgress';
import User from '../models/User';

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI as string);

const seedModules = async () => {
    try {
        console.log('Clearing existing disaster modules...');
        await DisasterModule.deleteMany({});

        console.log('Seeding new modules using centralized seedData...');
        await seedAllModules();
        await seedBadges();

        console.log('✅ Modules seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding modules:', error);
        process.exit(1);
    }
};

seedModules();
