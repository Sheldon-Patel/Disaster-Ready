import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Badge from '../models/Badge';
import UserProgress from '../models/UserProgress';

dotenv.config();

const awardRetroactiveBadges = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);

        console.log('Fetching students...');
        const students = await User.find({ role: 'student' });
        console.log(`Found ${students.length} students.`);

        const allBadges = await Badge.find();
        let totalAwarded = 0;

        for (const student of students) {
            // Recalculate modules completed
            const completedModules = await UserProgress.countDocuments({
                userId: student._id.toString(),
                status: 'completed'
            });

            // Calculate exact points based on user progress
            const progresses = await UserProgress.find({
                userId: student._id.toString(),
                status: 'completed'
            });
            const pointsFromModules = progresses.reduce((sum, p) => sum + (p.score || 0), 0);

            // Recalculate average score
            const averageScore = completedModules > 0
                ? pointsFromModules / completedModules
                : 0;

            let newlyEarnedBadges: mongoose.Types.ObjectId[] = [];
            const currentBadgeIds = student.badges?.map(b => b.toString()) || [];

            for (const badge of allBadges) {
                if (currentBadgeIds.includes(badge._id.toString())) continue;

                let earned = false;

                // Check criteria
                if (badge.criteria.includes('1 module') && completedModules >= 1) earned = true;
                if (badge.criteria.includes('3 modules') && completedModules >= 3) earned = true;
                if (badge.criteria.includes('5 modules') && completedModules >= 5) earned = true;

                // For Perfect Score, check if any progress has score 100
                if (badge.criteria.includes('100% on any quiz')) {
                    if (progresses.some(p => p.score === 100)) earned = true;
                }

                if (badge.criteria.includes('85% average across 3 modules')) {
                    if (completedModules >= 3 && averageScore >= 85) earned = true;
                }

                if (badge.criteria.includes('1000 total points') && student.points && student.points >= 1000) earned = true;

                if (earned) {
                    newlyEarnedBadges.push(badge._id as mongoose.Types.ObjectId);
                    totalAwarded++;
                }
            }

            if (newlyEarnedBadges.length > 0) {
                await User.findByIdAndUpdate(student._id, {
                    $push: { badges: { $each: newlyEarnedBadges } }
                });
                console.log(`Awarded ${newlyEarnedBadges.length} new badges to ${student.name}`);
            }
        }

        console.log(`\n✅ Finished! Retroactively awarded ${totalAwarded} badges total.`);
        process.exit();
    } catch (error) {
        console.error('❌ Error awarding badges:', error);
        process.exit(1);
    }
};

awardRetroactiveBadges();
