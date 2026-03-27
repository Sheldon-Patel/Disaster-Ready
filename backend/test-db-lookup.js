const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    try {
        const up = await mongoose.connection.collection('userprogresses').findOne();
        console.log('Sample UserProgress userId type:', typeof up.userId, 'Value:', up.userId);
        console.log('Sample UserProgress moduleId type:', typeof up.moduleId, 'Value:', up.moduleId);

        const testAgg = await mongoose.connection.collection('users').aggregate([
            { $match: { role: 'student' } },
            { $limit: 1 },
            {
                $lookup: {
                    from: 'userprogresses',
                    let: { uid: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$userId', { $toString: '$$uid' }] },
                                        { $eq: ['$status', 'completed'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'completedModules'
                }
            }
        ]).toArray();
        console.log('Aggregation matched progress:', testAgg[0].completedModules);
    } catch (e) {
        console.error(e);
    }
    process.exit();
});
