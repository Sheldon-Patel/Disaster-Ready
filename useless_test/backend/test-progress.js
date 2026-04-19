const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    try {
        const student = await mongoose.connection.collection('users').findOne({ role: 'student' });
        if (!student) {
            console.log('No student found');
            process.exit(1);
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

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
                const parsed = JSON.parse(data);
                console.log('Response from progress for user', student.name, ':', JSON.stringify(parsed, null, 2));
                process.exit(0);
            });
        });
        req.on('error', e => {
            console.error(e);
            process.exit(1);
        });
        req.end();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
