const axios = require('axios');

async function test() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'teacher@sta.school.edu.in',
            password: 'password123'
        });

        // First let's check Teacher's school
        console.log("Teacher School:", loginRes.data.data.user.school);
        const token = loginRes.data.data.token;

        // Fetch users as teacher
        const usersRes = await axios.get('http://localhost:5000/api/admin/users?role=student', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Teacher API count:", usersRes.data.count);
    } catch (e) {
        if (e.response && e.response.status === 401 && e.response.data.message === 'Invalid email or password') {
            // if password123 fails, try teacher123
            console.log("Trying teacher123");
            const l2 = await axios.post('http://localhost:5000/api/auth/login', { email: 'teacher@sta.school.edu.in', password: 'teacher123' }).catch(x => null);
            if (l2 && l2.data.data.token) {
                console.log("Teacher School:", l2.data.data.user.school);
                const u2 = await axios.get('http://localhost:5000/api/admin/users?role=student', { headers: { Authorization: `Bearer ${l2.data.data.token}` } });
                console.log("Teacher API count:", u2.data.count);
            } else {
                console.log("Both passwords failed");
            }
        } else {
            console.error("API Error:", e.response ? e.response.data : e.message);
        }
    }
}

test();
