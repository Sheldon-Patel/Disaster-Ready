const axios = require('axios');

async function test() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'sheldonpatel98@gmail.com',
            password: 'sheldon@123'
        });
        const token = loginRes.data.token;

        // Fetch profile
        const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Profile Data ID:", profileRes.data.data._id);
        console.log("Profile Data School:", profileRes.data.data.school);
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}

test();
