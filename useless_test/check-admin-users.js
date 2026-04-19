const axios = require('axios');

async function test() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@disasterready.in',
            password: 'admin123'
        });
        const token = loginRes.data.data.token;

        // Fetch users as admin
        const usersRes = await axios.get('http://localhost:5000/api/admin/users?role=student', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Users API count:", usersRes.data.count);
        console.log("Total Users in DB:", usersRes.data.total);
        console.log("Returned sample:", usersRes.data.data.slice(0, 1));
    } catch (e) {
        console.error("API Error:", e.response ? e.response.data : e.message);
    }
}

test();
