const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin123:admin123@cluster0.bpby1cf.mongodb.net/disaster-ready?retryWrites=true&w=majority&appName=Cluster0';

async function dropCollection() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const punjabAlertsExists = collections.some(col => col.name === 'punjabalerts');

        if (punjabAlertsExists) {
            await mongoose.connection.db.dropCollection('punjabalerts');
            console.log('Collection "punjabalerts" dropped successfully.');
        } else {
            console.log('Collection "punjabalerts" does not exist.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error dropping collection:', error);
        process.exit(1);
    }
}

dropCollection();
