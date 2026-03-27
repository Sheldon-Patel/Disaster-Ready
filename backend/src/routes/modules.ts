import express from 'express';
import {
  getModules,
  getModule,
  startModule,
  submitQuiz,
  getUserProgress,
  createModule,
  rateModule
} from '../controllers/moduleController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getModules);

// Protected specific routes MUST come before /:id wildcard
router.get('/progress/my', protect, getUserProgress);

// Public single module (wildcard - must be after specific paths)
router.get('/:id', getModule);

// Protected module actions
router.post('/:id/start', protect, startModule);
router.post('/:id/submit-quiz', protect, submitQuiz);
router.post('/:id/rate', protect, rateModule);

// Admin only routes
router.post('/', protect, authorize('admin'), createModule);

export default router;
