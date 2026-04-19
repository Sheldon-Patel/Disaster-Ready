import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Question, QuizResult, DisasterModule } from '../../types';
import { moduleService } from '../../services/moduleService';
import { useAuth } from '../../contexts/AuthContext';
import { gamificationService } from '../../services/gamificationService';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateUser, refreshProfile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [moduleType, setModuleType] = useState<string>('earthquake');
  const [moduleTitle, setModuleTitle] = useState<string>('Disaster Preparedness');

  // Question pool is now fetched dynamically from the API instead of being hardcoded
  const initializeQuiz = async () => {
    try {
      if (id) {
        try {
          const module = await moduleService.getModuleById(id);
          setModuleType(module.type);
          setModuleTitle(module.title);

          const moduleQuestions = module.quiz?.questions || [];

          // Select 5 random questions from the pool
          let selectedQuestions: Question[];
          const shuffled = [...moduleQuestions].sort(() => Math.random() - 0.5);
          selectedQuestions = shuffled.slice(0, 5);

          setQuestions(selectedQuestions);
          setTimeLeft((module.quiz?.timeLimit || 15) * 60);
          setHasStarted(true);
          setIsLoading(false);
          return;
        } catch (error) {
          console.log('Could not fetch module info from API', error);
        }
      }
    } catch (error) {
      console.error('Error fetching module:', error);
    }

    // Fallback if API fails
    setQuestions([]);
    setTimeLeft(15 * 60);
    setHasStarted(true);
    setIsLoading(false);
  };

  useEffect(() => {
    // Load module information when component mounts
    const loadModuleInfo = async () => {
      if (id) {
        try {
          const module = await moduleService.getModuleById(id);
          setModuleType(module.type);
          setModuleTitle(module.title);
        } catch (error) {
          console.log('Could not fetch module info, using defaults');
        }
      }
      setIsLoading(false);
    };
    loadModuleInfo();
  }, [id]);

  const startQuiz = async () => {
    setIsLoading(true);
    // Small delay for better UX
    setTimeout(async () => {
      try {
        if (id) {
          await moduleService.startModule(id);
        }
      } catch (error) {
        console.error('Error starting module:', error);
      }
      await initializeQuiz();
    }, 500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsQuizCompleted(false);
    setQuizResult(null);
    setHasStarted(false);
    setIsSubmitting(false);
    setTimeLeft(0);
    setQuestions([]);
  };

  useEffect(() => {
    if (hasStarted && timeLeft > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (hasStarted && timeLeft === 0 && !isQuizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isQuizCompleted, hasStarted]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    setIsQuizCompleted(true);

    // Pre-evaluate responses on client side
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const results = questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }
      totalPoints += question.points;

      return {
        questionId: question.id,
        userAnswer: userAnswer !== undefined ? userAnswer : -1,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70;

    const clientResults = {
      score,
      passed,
      correctAnswers,
      totalQuestions: questions.length,
      earnedPoints,
      totalPoints,
      passingScore: 70,
      results,
      badgesEarned: passed ? ['Quiz Master'] : []
    };

    try {
      if (id) {
        const timeSpent = (15 * 60) - timeLeft;
        const result = await moduleService.submitQuiz(id, answers, timeSpent, clientResults);

        // Trigger the backend to officially check and award any real Gamification MongoDB badges
        if (clientResults.passed) {
          try {
            await gamificationService.checkAndAwardBadges();
          } catch (err) {
            console.error('Badge check failed:', err);
          }

          // Instantly sync the user's Points and Badges in the Navbar without needing a page refresh
          try {
            await refreshProfile();
          } catch (err) {
            console.error('Profile refresh failed:', err);
          }
        }

        // Add badgesEarned from the backend if it issued any (like 'first_completion')
        if (result && result.badgesEarned) {
          clientResults.badgesEarned = Array.from(new Set([...clientResults.badgesEarned, ...result.badgesEarned]));
        }
        setQuizResult(clientResults);
      }
    } catch (error) {
      console.error('Error submitting quiz to backend:', error);
      // Fallback local calculation if API completely fails to connect
      setQuizResult(clientResults);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!hasStarted && !isQuizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{moduleTitle} Quiz</h1>
              <p className="text-lg text-gray-600 mb-6">
                Test your knowledge about {moduleTitle.toLowerCase()} and safety measures.
              </p>
            </div>

            {/* Quiz Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">15</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">70%</div>
                  <div className="text-sm text-gray-600">Passing Score</div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-left mb-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                  <span>You have 15 minutes to complete all 5 questions</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                  <span>You can navigate between questions using the numbered buttons</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                  <span>You need to score at least 70% to pass</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                  <span>Answer all questions before submitting the quiz</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
                  <span>The quiz will auto-submit when time runs out</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/modules/${id}`}
                className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Back to Module
              </Link>
              <button
                onClick={startQuiz}
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-semibold"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isQuizCompleted && quizResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quiz Results */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${quizResult.passed ? 'bg-green-100' : 'bg-red-100'
                }`}>
                {quizResult.passed ? (
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {quizResult.passed ? 'Congratulations!' : 'Quiz Complete'}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {quizResult.passed
                  ? 'You passed the quiz! Great job on your disaster preparedness knowledge.'
                  : 'You need to score at least 70% to pass. Review the material and try again.'
                }
              </p>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{quizResult.score}%</div>
                <div className="text-sm text-gray-500">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{quizResult.correctAnswers}/{quizResult.totalQuestions}</div>
                <div className="text-sm text-gray-500">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{quizResult.earnedPoints}</div>
                <div className="text-sm text-gray-500">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{quizResult.passingScore}%</div>
                <div className="text-sm text-gray-500">Passing Score</div>
              </div>
            </div>

            {/* Question Review */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h2>
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const result = quizResult.results.find(r => r.questionId === question.id);
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${result?.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {result?.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded ${optionIndex === result?.correctAnswer
                              ? 'bg-green-50 border border-green-200'
                              : optionIndex === result?.userAnswer && !result?.isCorrect
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-gray-50'
                              }`}
                          >
                            <div className="flex items-center">
                              <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                              <span className={optionIndex === result?.correctAnswer ? 'text-green-800' :
                                optionIndex === result?.userAnswer && !result?.isCorrect ? 'text-red-800' : 'text-gray-700'}>
                                {option}
                              </span>
                              {optionIndex === result?.correctAnswer && (
                                <svg className="w-4 h-4 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {result?.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {result.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/modules/${id}`}
                className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Back to Module
              </Link>

              {!quizResult.passed && (
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Retake Quiz
                </button>
              )}

              <Link
                to="/modules"
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{moduleTitle} Quiz</h1>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${timeLeft > 300 ? 'bg-green-100 text-green-800' :
                  timeLeft > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion?.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${answers[currentQuestion.id] === index
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="px-8 py-4 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${index === currentQuestionIndex
                      ? 'bg-red-600 text-white'
                      : answers[questions[index].id] !== undefined
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>You can navigate between questions using the numbered buttons above.</p>
          <p>Make sure to answer all questions before submitting.</p>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
