const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://danish08coder:eY9yX2S8D6aR7wG4@disaster-ready.h5kmd.mongodb.net/disaster-ready?retryWrites=true&w=majority&appName=disaster-ready').then(async () => {
  const db = mongoose.connection.db;
  await db.collection('disastermodules').updateMany({}, {$set: {completions: 0, ratings: 0}});
  console.log('Done resetting.');
  process.exit(0);
});
