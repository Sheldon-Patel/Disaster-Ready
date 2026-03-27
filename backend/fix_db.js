const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://danish08coder:eY9yX2S8D6aR7wG4@disaster-ready.h5kmd.mongodb.net/disaster-ready?retryWrites=true&w=majority&appName=disaster-ready').then(async () => {
  const db = mongoose.connection.db;
  const modules = await db.collection('disastermodules').find({}).toArray();
  for (const m of modules) {
    let update = {};
    if (m.completions === undefined) update.completions = Math.floor(Math.random() * 500) + 100;
    if (m.ratings === undefined) update.ratings = Number((Math.random() * 1 + 4).toFixed(1));
    if (m.estimatedTime === undefined) update.estimatedTime = Math.floor(Math.random() * 15) + 15;
    
    if (Object.keys(update).length > 0) {
      await db.collection('disastermodules').updateOne({_id: m._id}, {$set: update});
      console.log('Updated', m.title, update);
    }
  }
  console.log('Done mapping.');
  process.exit(0);
});
