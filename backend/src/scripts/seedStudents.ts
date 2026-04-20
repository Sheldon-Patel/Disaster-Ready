/**
 * Seed 25 realistic Indian student accounts with module progress.
 * 13 students from "STA School" and 12 from other Indian schools.
 * Run with: npx tsx src/scripts/seedStudents.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User';
import UserProgress from '../models/UserProgress';
import DisasterModule from '../models/DisasterModule';

// ── 25 Indian Students ──────────────────────────────────────────────
const students = [
    // ── 13 STA School Students ──────────────────────────────────────
    { name: 'Aarav Sharma', email: 'aarav.sharma@sta.edu.in', phone: '9812345601', school: 'STA School', grade: 10, district: 'Mumbai', emergencyContact: '9812345602', points: 420 },
    { name: 'Priya Patel', email: 'priya.patel@sta.edu.in', phone: '9812345603', school: 'STA School', grade: 9, district: 'Mumbai', emergencyContact: '9812345604', points: 350 },
    { name: 'Rohan Deshmukh', email: 'rohan.deshmukh@sta.edu.in', phone: '9812345605', school: 'STA School', grade: 11, district: 'Mumbai', emergencyContact: '9812345606', points: 580 },
    { name: 'Ananya Iyer', email: 'ananya.iyer@sta.edu.in', phone: '9812345607', school: 'STA School', grade: 10, district: 'Mumbai', emergencyContact: '9812345608', points: 290 },
    { name: 'Vivaan Nair', email: 'vivaan.nair@sta.edu.in', phone: '9812345609', school: 'STA School', grade: 12, district: 'Mumbai', emergencyContact: '9812345610', points: 710 },
    { name: 'Ishita Kulkarni', email: 'ishita.kulkarni@sta.edu.in', phone: '9812345611', school: 'STA School', grade: 9, district: 'Mumbai', emergencyContact: '9812345612', points: 180 },
    { name: 'Arjun Joshi', email: 'arjun.joshi@sta.edu.in', phone: '9812345613', school: 'STA School', grade: 10, district: 'Mumbai', emergencyContact: '9812345614', points: 460 },
    { name: 'Diya Menon', email: 'diya.menon@sta.edu.in', phone: '9812345615', school: 'STA School', grade: 11, district: 'Mumbai', emergencyContact: '9812345616', points: 530 },
    { name: 'Kabir Thakur', email: 'kabir.thakur@sta.edu.in', phone: '9812345617', school: 'STA School', grade: 10, district: 'Mumbai', emergencyContact: '9812345618', points: 320 },
    { name: 'Meera Rao', email: 'meera.rao@sta.edu.in', phone: '9812345619', school: 'STA School', grade: 12, district: 'Mumbai', emergencyContact: '9812345620', points: 640 },
    { name: 'Siddharth Bhatt', email: 'siddharth.bhatt@sta.edu.in', phone: '9812345621', school: 'STA School', grade: 9, district: 'Mumbai', emergencyContact: '9812345622', points: 150 },
    { name: 'Tara Kapoor', email: 'tara.kapoor@sta.edu.in', phone: '9812345623', school: 'STA School', grade: 11, district: 'Mumbai', emergencyContact: '9812345624', points: 490 },
    { name: 'Aditya Reddy', email: 'aditya.reddy@sta.edu.in', phone: '9812345625', school: 'STA School', grade: 10, district: 'Mumbai', emergencyContact: '9812345626', points: 380 },

    // ── 12 Students from Other Schools ──────────────────────────────
    { name: 'Riya Gupta', email: 'riya.gupta@dps.edu.in', phone: '9823456701', school: 'Delhi Public School, Noida', grade: 10, district: 'Noida', emergencyContact: '9823456702', points: 400 },
    { name: 'Karan Singh', email: 'karan.singh@kvs.edu.in', phone: '9823456703', school: 'Kendriya Vidyalaya, Chandigarh', grade: 11, district: 'Chandigarh', emergencyContact: '9823456704', points: 550 },
    { name: 'Sneha Verma', email: 'sneha.verma@dav.edu.in', phone: '9823456705', school: 'DAV Public School, Ludhiana', grade: 9, district: 'Ludhiana', emergencyContact: '9823456706', points: 270 },
    { name: 'Rahul Mishra', email: 'rahul.mishra@ryan.edu.in', phone: '9823456707', school: 'Ryan International, Pune', grade: 10, district: 'Pune', emergencyContact: '9823456708', points: 340 },
    { name: 'Pooja Tiwari', email: 'pooja.tiwari@gd.edu.in', phone: '9823456709', school: 'GD Goenka School, Gurgaon', grade: 12, district: 'Gurgaon', emergencyContact: '9823456710', points: 620 },
    { name: 'Amit Saxena', email: 'amit.saxena@bvm.edu.in', phone: '9823456711', school: 'BVM School, Ahmedabad', grade: 10, district: 'Ahmedabad', emergencyContact: '9823456712', points: 310 },
    { name: 'Nisha Pillai', email: 'nisha.pillai@chs.edu.in', phone: '9823456713', school: 'City High School, Kochi', grade: 11, district: 'Kochi', emergencyContact: '9823456714', points: 480 },
    { name: 'Vikram Chauhan', email: 'vikram.chauhan@sjb.edu.in', phone: '9823456715', school: 'St. Johns School, Bengaluru', grade: 9, district: 'Bengaluru', emergencyContact: '9823456716', points: 200 },
    { name: 'Divya Naik', email: 'divya.naik@kvs2.edu.in', phone: '9823456717', school: 'Kendriya Vidyalaya, Jaipur', grade: 10, district: 'Jaipur', emergencyContact: '9823456718', points: 360 },
    { name: 'Aryan Das', email: 'aryan.das@dps2.edu.in', phone: '9823456719', school: 'Delhi Public School, Kolkata', grade: 12, district: 'Kolkata', emergencyContact: '9823456720', points: 590 },
    { name: 'Kavya Hegde', email: 'kavya.hegde@mps.edu.in', phone: '9823456721', school: 'Manipal Public School, Manipal', grade: 10, district: 'Manipal', emergencyContact: '9823456722', points: 430 },
    { name: 'Farhan Sheikh', email: 'farhan.sheikh@ais.edu.in', phone: '9823456723', school: 'Amity International, Lucknow', grade: 11, district: 'Lucknow', emergencyContact: '9823456724', points: 510 },
];

// ── Module progress patterns ─────────────────────────────────────────
// Give each student a different subset of completed/in-progress modules
function getProgressForStudent(index: number, moduleIds: string[]) {
    const progress: Array<{
        moduleId: string;
        status: 'completed' | 'in_progress' | 'not_started';
        score: number;
        attempts: number;
        timeSpent: number;
        completedAt?: Date;
    }> = [];

    // Each student completes 2-5 modules and has 1-2 in progress
    const completedCount = 2 + (index % 4); // 2-5
    const inProgressCount = 1 + (index % 2); // 1-2

    for (let i = 0; i < moduleIds.length && i < completedCount; i++) {
        const dayOffset = Math.floor(Math.random() * 30);
        progress.push({
            moduleId: moduleIds[(index + i) % moduleIds.length],
            status: 'completed',
            score: 60 + Math.floor(Math.random() * 40), // 60-99
            attempts: 1 + Math.floor(Math.random() * 3),
            timeSpent: 300 + Math.floor(Math.random() * 600), // 5-15 min
            completedAt: new Date(Date.now() - dayOffset * 86400000),
        });
    }

    for (let i = 0; i < inProgressCount; i++) {
        const mIdx = (index + completedCount + i) % moduleIds.length;
        if (!progress.find(p => p.moduleId === moduleIds[mIdx])) {
            progress.push({
                moduleId: moduleIds[mIdx],
                status: 'in_progress',
                score: 0,
                attempts: 1,
                timeSpent: 60 + Math.floor(Math.random() * 300),
            });
        }
    }

    return progress;
}

async function main() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('🔌 Connected to MongoDB');

        // ── Step 1: Remove old demo users ────────────────────────────
        const adminEmail = 'admin@disasterready.in';
        const deleteResult = await User.deleteMany({
            $or: [
                { role: 'teacher' },
                { email: adminEmail },
                { email: { $in: ['admin@demo.com', 'teacher@demo.com', 'student@demo.com'] } }
            ]
        });
        console.log(`🗑️  Removed ${deleteResult.deletedCount} old admin and teacher accounts`);

        // ── Step 2: Create Admin ───────────────────────────────
        console.log('👤 Creating System Admin account...');
        await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: 'admin123',
            role: 'admin',
            isActive: true,
            school: 'Disaster Ready HQ'
        });
        console.log(`✅ Created Admin: ${adminEmail} / admin123`);

        // ── Step 3: Create Teachers for each unique school ───────────
        const uniqueSchools = [...new Set(students.map(s => s.school))];
        console.log(`👤 Creating Teachers for ${uniqueSchools.length} unique schools...`);

        for (const school of uniqueSchools) {
            // Create a slug for the email
            const slug = school.toLowerCase()
                .replace(/[^a-z0-9]+/g, '.')
                .replace(/(^\.|\.$)/g, '');
            const teacherEmail = `teacher@${slug}.edu.in`;

            await User.create({
                name: `${school} Teacher`,
                email: teacherEmail,
                password: 'teacher123',
                role: 'teacher',
                isActive: true,
                school: school
            });
            console.log(`  ✅ ${school} -> ${teacherEmail}`);
        }

        // ── Step 2: Get all module IDs ───────────────────────────────
        const modules = await DisasterModule.find({}, '_id').lean();
        const moduleIds = modules.map(m => m._id.toString());
        console.log(`📚 Found ${moduleIds.length} modules for progress seeding`);

        if (moduleIds.length === 0) {
            console.error('❌ No modules found. Run the main seed first.');
            process.exit(1);
        }

        // ── Step 3: Create students + progress ───────────────────────
        let created = 0;
        let skipped = 0;

        for (let i = 0; i < students.length; i++) {
            const s = students[i];

            const existing = await User.findOne({ email: s.email });
            if (existing) {
                console.log(`  ⏭️  ${s.name} already exists`);
                skipped++;
                continue;
            }

            const user = await User.create({
                name: s.name,
                email: s.email,
                password: 'student123', // same password for all demo students
                role: 'student',
                phone: s.phone,
                school: s.school,
                grade: s.grade,
                points: s.points,
                badges: [],
                isActive: true,
                lastLogin: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000),
                profile: {
                    district: s.district,
                    emergencyContact: s.emergencyContact,
                },
            });

            // Create module progress for this student
            const progressEntries = getProgressForStudent(i, moduleIds);
            for (const entry of progressEntries) {
                try {
                    await UserProgress.create({
                        userId: user._id.toString(),
                        moduleId: entry.moduleId,
                        status: entry.status,
                        score: entry.score,
                        attempts: entry.attempts,
                        timeSpent: entry.timeSpent,
                        completedAt: entry.completedAt,
                    });
                } catch (e: any) {
                    // Skip duplicate progress entries
                    if (e.code !== 11000) console.error(`    ⚠️ Progress error: ${e.message}`);
                }
            }

            const completedModules = progressEntries.filter(p => p.status === 'completed').length;
            console.log(`  ✅ ${s.name} (${s.school}, Grade ${s.grade}) — ${completedModules} modules completed`);
            created++;
        }

        console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`);
        console.log('📝 All student passwords: student123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
