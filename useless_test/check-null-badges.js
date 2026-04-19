const axios = require('axios');

async function test() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'teacher@sta.school.edu.in',
            password: 'teacher123'
        });

        const token = loginRes.data.data.token;

        // Fetch users as teacher
        const usersRes = await axios.get('http://localhost:5000/api/admin/users?role=student', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const users = usersRes.data.data;
        let nullBadgeCount = 0;
        for (const u of users) {
            if (u.badges) {
                for (const b of u.badges) {
                    if (b === null) {
                        nullBadgeCount++;
                    }
                }
            }
        }

        console.log("Students with null badges found:", nullBadgeCount);

        // Also check for unpopulated badge strings/objectIDs
        let stringBadgeCount = 0;
        for (const u of users) {
            if (u.badges) {
                for (const b of u.badges) {
                    if (typeof b === 'string') {
                        stringBadgeCount++;
                    }
                }
            }
        }
        console.log("Students with unpopulated string badges found:", stringBadgeCount);

    } catch (e) {
        console.error("API Error:", e.response ? e.response.data : e.message);
    }
}

test();
