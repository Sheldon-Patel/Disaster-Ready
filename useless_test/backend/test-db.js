const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin123:admin123@cluster0.bpby1cf.mongodb.net/disaster-ready?retryWrites=true&w=majority&appName=Cluster0';

async function checkData() {
  try {
    await mongoose.connect(uri);

    // Find Sheldon
    const users = await mongoose.connection.db.collection('users').find({ email: 'sheldonpatel98@gmail.com' }).toArray();
    console.log('User:', users[0]?._id, users[0]?.email);

    if (users.length > 0) {
      const progress = await mongoose.connection.db.collection('userprogresses').find({ userId: String(users[0]._id) }).toArray();
      console.log('Progress records:', progress.length);
      progress.forEach(p => console.log(p));
    }

    console.log('\nModules:');
    const modules = await mongoose.connection.db.collection('disastermodules').find({}).project({ title: 1, completions: 1, "quiz.timeLimit": 1 }).toArray();
    modules.forEach(m => console.log(`${m.title}: ${m.completions || 0} completions, Time Limit: ${m.quiz?.timeLimit} mins, ID: ${m._id}`));

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

checkData();
