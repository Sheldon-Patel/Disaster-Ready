const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'student@demo.com',
      password: 'student123'
    });
    const token = loginRes.data.token;
    
    // Simulate user selecting correct answers.
    // eq_q1: correctAnswer: 1
    // eq_q2: correctAnswer: 2
    
    const answers = {
      'q1': 1,
      'q2': 2
    };

    const clientResults = {
      score: 100,
      passed: true,
      correctAnswers: 2,
      earnedPoints: 25,
      totalPoints: 25,
      results: [
        { questionId: 'q1', userAnswer: 1, correctAnswer: 1, isCorrect: true, points: 10 },
        { questionId: 'q2', userAnswer: 2, correctAnswer: 2, isCorrect: true, points: 15 }
      ]
    };

    // get module
    const modulesRes = await axios.get('http://localhost:5000/api/modules', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const eqModule = modulesRes.data.data.find(m => m.type === 'earthquake');
    const moduleId = eqModule._id;

    const res = await axios.post(`http://localhost:5000/api/modules/${moduleId}/submit-quiz`, {
      answers,
      timeSpent: 60,
      clientResults
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Success with clientResults:", res.data.message);

    // Also get module to check
    const moduleRes = await axios.get(`http://localhost:5000/api/modules/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Q1 correctAnswer:", moduleRes.data.data.quiz.questions[0].correctAnswer);
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

test();
