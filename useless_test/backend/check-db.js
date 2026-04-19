const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const up = await mongoose.connection.collection('userprogresses').findOne();
  console.log('Sample UserProgress:', up);
  
  if (up) {
    // try to do the aggregation
    const test = await mongoose.connection.collection('users').aggregate([
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
    console.log('Test aggregation result userId:', test[0]._id.toString(), 'completedModules count:', test[0].completedModules.length);
  }

  process.exit(0);
});
