const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = mongoose.connection.collection('users');
  const student = await User.findOne({ role: 'student', email: 'aarav.s@example.com' });
  
  if (!student) {
    console.log('No student found');
    process.exit(1);
  }

  // Generate JWT token manually
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

  // Test getMyProgress
  const http = require('http');
  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/modules/progress/my',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response from progress:', data);
      
      // Also test the leaderboard aggregation
      mongoose.connection.collection('users').aggregate([
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
      ]).toArray().then(arr => {
        console.log('Leaderboard test completedModules count:', arr[0].completedModules.length);
        console.log('User ID was string?:', typeof arr[0]._id, arr[0]._id);
        process.exit(0);
      });
    });
  });
  req.on('error', e => {
    console.error(e);
    process.exit(1);
  });
  req.end();
});
