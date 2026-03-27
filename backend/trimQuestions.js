const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
}

mongoose.connect(uri).then(async () => {
    const DisasterModuleSchema = new mongoose.Schema({}, { strict: false });
    const DisasterModule = mongoose.model('DisasterModule', DisasterModuleSchema, 'disastermodules');

    const titles = [
        'Cyclone Preparedness',
        'Heatwave Safety',
        'Drought Preparedness',
        'Tornado Safety Guide',
        'Gas Leak Response',
        'Building Collapse Survival'
    ];

    for (const title of titles) {
        const doc = await DisasterModule.findOne({ title });
        if (doc && doc.get('quiz.questions')) {
            const currentQuestions = doc.get('quiz.questions');
            if (currentQuestions.length > 5) {
                const trimmed = currentQuestions.slice(0, 5);
                await DisasterModule.updateOne({ title }, { $set: { 'quiz.questions': trimmed } });
                console.log(`✅ Trimmed questions to 5 for: ${title}`);
            } else {
                console.log(`⚠️ ${title} already has ${currentQuestions.length} questions`);
            }
        }
    }
    console.log('🎉 Done trimming questions!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
