const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'sheldonpatel98@gmail.com',
      password: 'sheldon@123'
    });
    const token = loginRes.data.token;

    console.log("Logged in user:", loginRes.data.user);

    // 1. Fetch global leaderboard
    const globalRes = await axios.get('http://localhost:5000/api/gamification/leaderboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Global Leaderboard count:", globalRes.data.count);

    // 2. Fetch school leaderboard (Demo School)
    const schoolRes = await axios.get('http://localhost:5000/api/gamification/leaderboard/school/Demo%20School', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("School Leaderboard count:", schoolRes.data.count);

    // 3. Fetch grade leaderboard
    const gradeRes = await axios.get(`http://localhost:5000/api/gamification/leaderboard?grade=${loginRes.data.user.grade || 10}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Grade Leaderboard count:", gradeRes.data.count);

  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

test();
