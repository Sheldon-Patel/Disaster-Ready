const axios = require('axios');

async function test() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@disasterready.in',
            password: 'admin123'
        });
        const token = loginRes.data.data.token;

        // Fetch users as admin
        const usersRes = await axios.get('http://localhost:5000/api/admin/users?role=student&limit=100', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const missingNames = usersRes.data.data.filter(u => !u.name || typeof u.name !== 'string');
        console.log(`Found ${missingNames.length} students with missing/invalid names.`);
        if (missingNames.length > 0) {
            console.log(missingNames.slice(0, 2).map(u => ({ id: u._id, email: u.email, name: u.name })));
        }

    } catch (e) {
        console.error("API Error:", e.response ? e.response.data : e.message);
    }
}

test();
