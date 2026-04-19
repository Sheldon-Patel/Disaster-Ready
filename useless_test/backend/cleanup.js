const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const progCol = mongoose.connection.collection('userprogresses');
    const modCol = mongoose.connection.collection('disastermodules');

    const userId = '69c61ea4576dc326c27eaae3';
    const progs = await progCol.find({ userId }).toArray();
    let deletedCount = 0;

    for (const p of progs) {
        let mod = null;
        try {
            mod = await modCol.findOne({ _id: new mongoose.Types.ObjectId(p.moduleId) });
        } catch (e) {
            mod = await modCol.findOne({ _id: p.moduleId });
        }

        if (!mod) {
            await progCol.deleteOne({ _id: p._id });
            deletedCount++;
            console.log('Deleted orphaned record for module ID:', p.moduleId);
        }
    }

    console.log('Total deleted:', deletedCount);
    const remaining = await progCol.countDocuments({ userId: userId, status: 'completed' });
    console.log('Final Sheldon COMPLETED count:', remaining);

    mongoose.disconnect();
}).catch(e => { console.error(e.message); process.exit(1); });
