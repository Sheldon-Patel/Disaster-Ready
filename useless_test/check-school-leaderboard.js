const axios = require('axios');

async function test() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'sheldonpatel98@gmail.com',
            password: 'sheldon@123'
        });
        const token = loginRes.data.token;

        // 2. Fetch school leaderboard (STA School)
        const schoolRes = await axios.get('http://localhost:5000/api/gamification/leaderboard/school/STA%20School', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("School Leaderboard count:", schoolRes.data.count);
        if (schoolRes.data.count > 0) {
            console.log("First user:", schoolRes.data.data[0]);
        }

    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}

test();
