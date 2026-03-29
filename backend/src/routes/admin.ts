import express from 'express';
import {
  getDashboardAnalytics,
  getUsers,
  updateUserStatus,
  getPreparednessScores,
  exportData,
  getAllModulesAdmin,
  createModuleAdmin,
  updateModuleAdmin,
  deleteModuleAdmin,
  getAllVideosAdmin,
  addVideoToModule,
  updateVideoInModule,
  deleteVideoFromModule
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Require authentication for all admin routes
router.use(protect);

// Dashboard and Analytics (Admin/Teacher)
router.get('/analytics', authorize('admin', 'teacher'), getDashboardAnalytics);

// User Management (Admin/Teacher)
router.get('/users', authorize('admin', 'teacher'), getUsers);
router.put('/users/:id/status', authorize('admin'), updateUserStatus);

// Preparedness Tracking (Admin/Teacher)
router.get('/preparedness-scores', authorize('admin', 'teacher'), getPreparednessScores);

// Data Export (Admin/Teacher)
router.get('/export/:type', authorize('admin', 'teacher'), exportData);

// Content Management (Admin Only)
router.use(authorize('admin'));

// Module Management
router.get('/modules', getAllModulesAdmin);
router.post('/modules', createModuleAdmin);
router.put('/modules/:id', updateModuleAdmin);
router.delete('/modules/:id', deleteModuleAdmin);

// Video Management
router.get('/videos', getAllVideosAdmin);
router.post('/videos', addVideoToModule);
router.put('/videos/:videoId', updateVideoInModule);
router.delete('/videos/:videoId', deleteVideoFromModule);
router.put('/modules/:moduleId/videos/:videoId', updateVideoInModule);

export default router;
