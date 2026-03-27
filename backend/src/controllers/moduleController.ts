import { Request, Response } from 'express';
import DisasterModule from '../models/DisasterModule';
import UserProgress from '../models/UserProgress';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all disaster modules
// @route   GET /api/modules
// @access  Public
export const getModules = async (req: Request, res: Response) => {
  try {
    const { type, difficulty, limit = 10, page = 1 } = req.query;

    const query: any = {};
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    const modules = await DisasterModule.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .select('-quiz.questions.correctAnswer'); // Don't send correct answers initially

    const total = await DisasterModule.countDocuments(query);

    res.status(200).json({
      success: true,
      count: modules.length,
      total,
      data: modules
    });

  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching modules'
    });
  }
};

// @desc    Get single disaster module
// @route   GET /api/modules/:id
// @access  Public
export const getModule = async (req: Request, res: Response) => {
  try {
    const module = await DisasterModule.findById(req.params.id)
      .select('-quiz.questions.correctAnswer'); // Don't send correct answers

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.status(200).json({
      success: true,
      data: module
    });

  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching module'
    });
  }
};

// @desc    Start module (track user progress)
// @route   POST /api/modules/:id/start
// @access  Private
export const startModule = async (req: AuthRequest, res: Response) => {
  try {
    const moduleId = req.params.id;
    const userId = req.user.id;

    // Check if module exists
    const module = await DisasterModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Check if user progress already exists
    let progress = await UserProgress.findOne({ userId, moduleId });

    if (!progress) {
      // Create new progress record
      progress = await UserProgress.create({
        userId,
        moduleId,
        status: 'in_progress',
        attempts: 1
      });
    } else {
      // Update existing progress
      progress.status = 'in_progress';
      progress.attempts += 1;
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: 'Module started successfully',
      data: {
        progress,
        module: {
          ...module.toObject(),
          quiz: {
            ...module.quiz,
            questions: module.quiz.questions.map(q => ({
              ...q,
              correctAnswer: undefined // Remove correct answer from response
            }))
          }
        }
      }
    });

  } catch (error) {
    console.error('Start module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting module'
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/modules/:id/submit-quiz
// @access  Private
export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const moduleId = req.params.id;
    const userId = req.user.id;
    const { answers, timeSpent, clientResults } = req.body;

    // Get module with correct answers
    const module = await DisasterModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Get user progress
    let progress = await UserProgress.findOne({ userId, moduleId });
    if (!progress) {
      return res.status(400).json({
        success: false,
        message: 'Please start the module first'
      });
    }

    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    let results: any[] = [];
    let score = 0;
    let passed = false;

    if (clientResults) {
      // Use client-provided grading since questions are generated randomly on frontend
      score = clientResults.score;
      passed = clientResults.passed;
      correctAnswers = clientResults.correctAnswers;
      earnedPoints = clientResults.earnedPoints;
      totalPoints = clientResults.totalPoints;
      results = clientResults.results;
    } else {
      // Fallback to legacy database evaluation
      results = module.quiz.questions.map((question: any) => {
        const userAnswer = answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;

        if (isCorrect) {
          correctAnswers++;
          earnedPoints += question.points || 20;
        }

        totalPoints += question.points || 20;

        return {
          questionId: question.id,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          points: isCorrect ? (question.points || 20) : 0,
          explanation: question.explanation
        };
      });

      score = Math.round((earnedPoints / totalPoints) * 100);
      passed = score >= (module.quiz?.passingScore || 70);
    }

    const wasAlreadyCompleted = progress.status === 'completed';

    // Update user progress
    progress.score = score;
    progress.status = passed ? 'completed' : 'in_progress';
    progress.timeSpent += timeSpent || 0;
    await progress.save();

    // Update user points if passed and not previously completed
    let badgesEarned: any[] = [];
    if (passed && !wasAlreadyCompleted) {
      const user = await User.findById(userId);
      if (user) {
        user.points = (user.points || 0) + earnedPoints;
        await user.save();

        // Check for badges (simple implementation)
        if (user.points >= 100 && !user.badges?.some(b => b.toString().includes('first'))) {
          badgesEarned.push('first_completion');
        }
        if (score === 100 && !user.badges?.some(b => b.toString().includes('perfect'))) {
          badgesEarned.push('perfect_score');
        }
      }

      // Update module completion count
      module.completions = (module.completions || 0) + 1;
      await module.save();
    }

    res.status(200).json({
      success: true,
      message: passed ? 'Quiz passed! Module completed.' : 'Quiz submitted. Try again to pass.',
      data: {
        score,
        passed,
        correctAnswers,
        totalQuestions: module.quiz.questions.length,
        earnedPoints,
        totalPoints,
        passingScore: module.quiz.passingScore,
        results,
        badgesEarned,
        progress
      }
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz'
    });
  }
};

// @desc    Get user's module progress
// @route   GET /api/modules/progress/my
// @access  Private
export const getUserProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user.id || req.user._id)?.toString();
    const { status } = req.query;

    const query: any = { userId };
    if (status) query.status = status;

    // moduleId is stored as String so populate() doesn't work - do a manual join
    const progress = await UserProgress.find(query).sort({ updatedAt: -1 });

    // Fetch module titles for each unique moduleId
    const moduleIds = [...new Set(progress.map(p => p.moduleId))];
    let moduleMap: Record<string, any> = {};
    if (moduleIds.length > 0) {
      const modules = await DisasterModule.find({ _id: { $in: moduleIds } })
        .select('title type difficulty');
      modules.forEach(m => {
        moduleMap[m._id.toString()] = { _id: m._id, title: m.title, type: m.type, difficulty: m.difficulty };
      });
    }

    const progressWithModules = progress.map(p => ({
      ...p.toObject(),
      moduleId: moduleMap[p.moduleId] || { _id: p.moduleId, title: 'Unknown Module' }
    }));

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progressWithModules
    });

  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress'
    });
  }
};

// @desc    Rate a disaster module
// @route   POST /api/modules/:id/rate
// @access  Private
export const rateModule = async (req: AuthRequest, res: Response) => {
  try {
    const moduleId = req.params.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5'
      });
    }

    const module = await DisasterModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // A simple rolling average approximation
    const currentRating = module.ratings || 0;
    const currentCompletions = module.completions || 1;

    // Smooth the update curve to prevent one rating from drastically shifting it
    const newRating = ((currentRating * currentCompletions) + rating) / (currentCompletions + 1);

    module.ratings = Number(newRating.toFixed(1));
    await module.save();

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error('Rate module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating module'
    });
  }
};

// @desc    Create new disaster module (Admin only)
// @route   POST /api/modules
// @access  Private (Admin)
export const createModule = async (req: Request, res: Response) => {
  try {
    const moduleData = req.body;

    const module = await DisasterModule.create(moduleData);

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: module
    });

  } catch (error: any) {
    console.error('Create module error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating module'
    });
  }
};
