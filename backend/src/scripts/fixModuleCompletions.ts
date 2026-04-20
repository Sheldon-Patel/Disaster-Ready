import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User';
import UserProgress from '../models/UserProgress';
import DisasterModule from '../models/DisasterModule';

const students = [
    { name: 'Aarav Sharma', email: 'aarav.sharma@sta.edu.in' },
    { name: 'Priya Patel', email: 'priya.patel@sta.edu.in' },
    { name: 'Rohan Deshmukh', email: 'rohan.deshmukh@sta.edu.in' },
    { name: 'Ananya Iyer', email: 'ananya.iyer@sta.edu.in' },
    { name: 'Vivaan Nair', email: 'vivaan.nair@sta.edu.in' },
    { name: 'Ishita Kulkarni', email: 'ishita.kulkarni@sta.edu.in' },
    { name: 'Arjun Joshi', email: 'arjun.joshi@sta.edu.in' },
    { name: 'Diya Menon', email: 'diya.menon@sta.edu.in' },
    { name: 'Kabir Thakur', email: 'kabir.thakur@sta.edu.in' },
    { name: 'Meera Rao', email: 'meera.rao@sta.edu.in' },
    { name: 'Siddharth Bhatt', email: 'siddharth.bhatt@sta.edu.in' },
    { name: 'Tara Kapoor', email: 'tara.kapoor@sta.edu.in' },
    { name: 'Aditya Reddy', email: 'aditya.reddy@sta.edu.in' },
    { name: 'Riya Gupta', email: 'riya.gupta@dps.edu.in' },
    { name: 'Karan Singh', email: 'karan.singh@kvs.edu.in' },
    { name: 'Sneha Verma', email: 'sneha.verma@dav.edu.in' },
    { name: 'Rahul Mishra', email: 'rahul.mishra@ryan.edu.in' },
    { name: 'Pooja Tiwari', email: 'pooja.tiwari@gd.edu.in' },
    { name: 'Amit Saxena', email: 'amit.saxena@bvm.edu.in' },
    { name: 'Nisha Pillai', email: 'nisha.pillai@chs.edu.in' },
    { name: 'Vikram Chauhan', email: 'vikram.chauhan@sjb.edu.in' },
    { name: 'Divya Naik', email: 'divya.naik@kvs2.edu.in' },
    { name: 'Aryan Das', email: 'aryan.das@dps2.edu.in' },
    { name: 'Kavya Hegde', email: 'kavya.hegde@mps.edu.in' },
    { name: 'Farhan Sheikh', email: 'farhan.sheikh@ais.edu.in' },
];

function getProgressForStudent(index: number, moduleIds: string[]) {
    const progress: any[] = [];
    const completedCount = 2 + (index % 4);
    const inProgressCount = 1 + (index % 2);

    for (let i = 0; i < moduleIds.length && i < completedCount; i++) {
        progress.push({
            moduleId: moduleIds[(index + i) % moduleIds.length],
            status: 'completed',
            score: 70 + Math.floor(Math.random() * 30),
            attempts: 1,
            timeSpent: 600,
            completedAt: new Date(),
        });
    }
    return progress;
}

async function fix() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error('MONGODB_URI not found');

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // 1. Clear all old progress
        console.log('🗑️ Clearing all user progress...');
        await UserProgress.deleteMany({});

        // 2. Get current module IDs
        const modules = await DisasterModule.find({}, '_id');
        const moduleIds = modules.map(m => m._id.toString());
        console.log(`📚 Found ${moduleIds.length} current modules`);

        if (moduleIds.length === 0) throw new Error('No modules found');

        // 3. Re-seed progress for students
        for (let i = 0; i < students.length; i++) {
            const s = students[i];
            const user = await User.findOne({ email: s.email });
            if (!user) {
                console.log(`  ⏭️ Student ${s.email} not found, skipping`);
                continue;
            }

            const progressEntries = getProgressForStudent(i, moduleIds);
            for (const entry of progressEntries) {
                await UserProgress.create({
                    userId: user._id,
                    moduleId: entry.moduleId,
                    status: entry.status,
                    score: entry.score,
                    attempts: entry.attempts,
                    timeSpent: entry.timeSpent,
                    completedAt: entry.completedAt,
                });
            }
            console.log(`  ✅ Restored progress for ${s.name}`);
        }

        console.log('🎉 Done! Refresh your page to see the counts.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fix();
