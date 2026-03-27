import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Badge from '../models/Badge';

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI as string);

const badges = [
    {
        name: 'First Steps',
        description: 'Completed your first disaster preparedness module.',
        icon: '🎯',
        points: 50,
        criteria: 'Complete 1 module',
        rarity: 'common'
    },
    {
        name: 'Knowledge Seeker',
        description: 'Completed 3 different disaster modules.',
        icon: '📚',
        points: 150,
        criteria: 'Complete 3 modules',
        rarity: 'rare'
    },
    {
        name: 'Disaster Expert',
        description: 'Completed 5 different disaster modules.',
        icon: '🎓',
        points: 300,
        criteria: 'Complete 5 modules',
        rarity: 'epic'
    },
    {
        name: 'Perfect Score',
        description: 'Achieved 100% on a module quiz.',
        icon: '⭐',
        points: 100,
        criteria: 'Score 100% on any quiz',
        rarity: 'rare'
    },
    {
        name: 'Consistent Learner',
        description: 'Maintained an average score of 85% across 3+ modules.',
        icon: '🔥',
        points: 200,
        criteria: '85% average across 3 modules',
        rarity: 'epic'
    },
    {
        name: 'Speed Learner',
        description: 'Completed a module in less than 10 minutes.',
        icon: '⚡',
        points: 100,
        criteria: 'Time spent < 10 mins',
        rarity: 'rare'
    },
    {
        name: 'Champion',
        description: 'Accumulated over 1,000 learning points.',
        icon: '🏆',
        points: 500,
        criteria: 'Earn 1000 total points',
        rarity: 'epic'
    },
    {
        name: 'Master',
        description: 'Elite status for earning 500+ points and maintaining a 90% average.',
        icon: '👑',
        points: 1000,
        criteria: '500 points + 90% average score',
        rarity: 'legendary'
    }
];

const seedBadges = async () => {
    try {
        console.log('Clearing existing badges...');
        await Badge.deleteMany({});

        console.log('Seeding new badges...');
        await Badge.insertMany(badges);

        console.log('✅ Badges seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding badges:', error);
        process.exit(1);
    }
};

seedBadges();
