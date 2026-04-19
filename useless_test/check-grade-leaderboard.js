const axios = require('axios');

async function test() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'sheldonpatel98@gmail.com',
            password: 'sheldon@123'
        });
        const token = loginRes.data.token;

        // Fetch grade leaderboard
        const gradeRes = await axios.get(`http://localhost:5000/api/gamification/leaderboard?grade=${loginRes.data.user.grade}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Grade Leaderboard count:", gradeRes.data.count);
        if (gradeRes.data.count > 0) {
            console.log("First user:", gradeRes.data.data[0]);
        }

    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}

test();
