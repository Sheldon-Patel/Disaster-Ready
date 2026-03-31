import { Request, Response } from 'express';
import User from '../models/User';
import DisasterModule from '../models/DisasterModule';
import UserProgress from '../models/UserProgress';
import DrillSession from '../models/DrillSession';
import Badge from '../models/Badge';
import { VirtualDrill } from '../models/VirtualDrill';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getDashboardAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const isTeacher = req.user.role === 'teacher';
    const schoolName = req.user.school;

    // Base filter for users
    const userFilter: any = { isActive: true };
    if (isTeacher) {
      userFilter.school = schoolName;
    }

    // Get total counts (specifically students for the dashboard overview)
    const totalUsers = await User.countDocuments({ ...userFilter, role: 'student' });
    const totalModules = await DisasterModule.countDocuments();
    const totalVirtualDrills = await VirtualDrill.countDocuments({ isActive: true });
    const totalBadges = await Badge.countDocuments();

    // User distribution by role
    const usersByRole = await User.aggregate([
      { $match: userFilter },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Users by district (from profile)
    const districtMatch: any = { isActive: true, 'profile.district': { $exists: true } };
    if (isTeacher) districtMatch.school = schoolName;

    const usersByDistrict = await User.aggregate([
      { $match: districtMatch },
      { $group: { _id: '$profile.district', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Module completion stats
    let moduleCompletionStats;
    if (isTeacher) {
      // Find IDs of all students in this school
      const schoolUserIds = (await User.find({ school: schoolName }).select('_id')).map(u => u._id.toString());

      moduleCompletionStats = await UserProgress.aggregate([
        { $match: { userId: { $in: schoolUserIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
    } else {
      moduleCompletionStats = await UserProgress.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
    }

    // Top performing schools
    const topSchools = await User.aggregate([
      {
        $match: {
          isActive: true,
          school: { $exists: true, $ne: null },
          points: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$school',
          totalStudents: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          averagePoints: { $avg: '$points' }
        }
      },
      { $sort: { averagePoints: -1 } },
      { $limit: 10 }
    ]);

    // Top Students (School Specific if teacher, Global if admin)
    const topStudents = await User.find(userFilter)
      .sort({ points: -1 })
      .limit(5)
      .select('name points grade school');

    // School Average Score
    let schoolAverageScore = 0;
    if (isTeacher) {
      const schoolUserIds = (await User.find({ school: schoolName }).select('_id')).map(u => u._id.toString());
      const avgResult = await UserProgress.aggregate([
        { $match: { userId: { $in: schoolUserIds }, status: 'completed' } },
        { $group: { _id: null, avgScore: { $avg: '$score' } } }
      ]);
      schoolAverageScore = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;
    } else {
      const avgResult = await UserProgress.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, avgScore: { $avg: '$score' } } }
      ]);
      schoolAverageScore = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;
    }

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentActivity = {
      newUsers: await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
        isActive: true
      }),
      completedModules: await UserProgress.countDocuments({
        completedAt: { $gte: sevenDaysAgo },
        status: 'completed'
      }),
      completedDrills: await DrillSession.countDocuments({
        endTime: { $gte: sevenDaysAgo },
        isCompleted: true
      })
    };

    // Module popularity
    const schoolUserIds = isTeacher
      ? (await User.find({ school: schoolName }).select('_id')).map(u => u._id.toString())
      : null;

    const modulePopularity = await DisasterModule.aggregate([
      {
        $lookup: {
          from: 'userprogresses',
          let: { moduleIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$moduleId', '$$moduleIdStr'] },
                ...(isTeacher ? { userId: { $in: schoolUserIds } } : {})
              }
            }
          ],
          as: 'progress'
        }
      },
      {
        $project: {
          title: 1,
          type: 1,
          difficulty: 1,
          totalAttempts: { $size: '$progress' },
          completions: {
            $size: {
              $filter: {
                input: '$progress',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $cond: {
              if: { $gt: ['$totalAttempts', 0] },
              then: { $multiply: [{ $divide: ['$completions', '$totalAttempts'] }, 100] },
              else: 0
            }
          }
        }
      },
      { $sort: { totalAttempts: -1 } }
    ]);

    // Drill performance by type
    const drillMatch: any = { isCompleted: true };
    if (isTeacher) drillMatch.userId = { $in: schoolUserIds };

    const drillPerformance = await DrillSession.aggregate([
      { $match: drillMatch },
      {
        $group: {
          _id: '$drillType',
          totalSessions: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averageTime: { $avg: '$totalTime' }
        }
      },
      { $sort: { totalSessions: -1 } }
    ]);

    // Badge distribution
    const badgeStats = await Badge.aggregate([
      {
        $lookup: {
          from: 'users',
          let: { badgeId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$$badgeId', '$badges'] },
                isActive: true,
                ...(isTeacher ? { school: schoolName } : {})
              }
            }
          ],
          as: 'holders'
        }
      },
      {
        $project: {
          name: 1,
          rarity: 1,
          points: 1,
          holdersCount: { $size: '$holders' }
        }
      },
      { $sort: { holdersCount: -1 } }
    ]);

    // Learning progress over time (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const progressTimeMatch: any = {
      completedAt: { $gte: thirtyDaysAgo },
      status: 'completed'
    };
    if (isTeacher) progressTimeMatch.userId = { $in: schoolUserIds };

    const learningProgress = await UserProgress.aggregate([
      { $match: progressTimeMatch },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' },
            day: { $dayOfMonth: '$completedAt' }
          },
          completions: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalModules,
          totalVirtualDrills,
          totalBadges,
          schoolAverageScore
        },
        userDistribution: {
          byRole: usersByRole,
          byDistrict: usersByDistrict
        },
        moduleStats: {
          completionStats: moduleCompletionStats,
          popularity: modulePopularity
        },
        drillStats: {
          performance: drillPerformance
        },
        topSchools,
        topStudents,
        recentActivity,
        badgeStats,
        learningProgress
      }
    });

  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics'
    });
  }
};

// @desc    Get user management data
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      school,
      district,
      search,
      isActive = 'true'
    } = req.query;

    const isTeacher = (req as any).user.role === 'teacher';
    const schoolName = (req as any).user.school;

    const query: any = {};

    if (isTeacher) {
      query.school = schoolName;
      query.role = role || 'student';
    } else if (role) {
      query.role = role;
    } else {
      query.role = 'student'; // Admin defaults to seeing all students
    }

    if (school && !isTeacher) query.school = new RegExp(school as string, 'i');
    if (district) query['profile.district'] = district;
    if (isActive !== 'all') query.isActive = isActive === 'true';

    if (search) {
      query.$or = [
        { name: new RegExp(search as string, 'i') },
        { email: new RegExp(search as string, 'i') }
      ];
    }

    const users = await User.find(query)
      .populate('badges', 'name icon rarity')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .select('-password');

    const total = await User.countDocuments(query);

    // Get detailed module progress
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const detailedProgress = await UserProgress.aggregate([
          { $match: { userId: user._id.toString() } },
          {
            $addFields: {
              moduleIdObj: { $toObjectId: '$moduleId' }
            }
          },
          {
            $lookup: {
              from: 'disastermodules',
              localField: 'moduleIdObj',
              foreignField: '_id',
              as: 'module'
            }
          },
          { $unwind: '$module' },
          {
            $project: {
              moduleTitle: '$module.title',
              status: 1,
              score: 1,
              completedAt: 1
            }
          }
        ]);

        const completedModulesCount = detailedProgress.filter(p => p.status === 'completed').length;
        const totalScore = detailedProgress.reduce((sum, p) => sum + (p.score || 0), 0);
        const averageScore = completedModulesCount > 0 ? Math.round(totalScore / completedModulesCount) : 0;

        return {
          ...user.toObject(),
          stats: {
            completedModules: completedModulesCount,
            averageScore,
            totalProgress: detailedProgress.length,
            detailedProgress
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: usersWithStats
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
};

// @desc    Get preparedness scores report
// @route   GET /api/admin/preparedness-scores
// @access  Private (Admin)
export const getPreparednessScores = async (req: Request, res: Response) => {
  try {
    const { school, grade, district, moduleType } = req.query;
    const isTeacher = (req as any).user.role === 'teacher';
    const teacherSchool = (req as any).user.school;

    // Build user filter
    const userFilter: any = { isActive: true };
    if (isTeacher) {
      userFilter.school = teacherSchool;
    } else if (school) {
      userFilter.school = new RegExp(school as string, 'i');
    }

    if (grade) userFilter.grade = Number(grade);
    if (district) userFilter['profile.district'] = district;

    // Get users matching criteria
    const users = await User.find(userFilter).select('_id name school grade profile.district');
    const userIds = users.map(u => u._id);

    if (userIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No users found matching criteria',
        data: []
      });
    }

    // Build progress filter
    const progressFilter: any = {
      userId: { $in: userIds },
      status: 'completed'
    };

    // Get progress data with module details
    const progressData = await UserProgress.aggregate([
      { $match: progressFilter },
      {
        $lookup: {
          from: 'disastermodules',
          localField: 'moduleId',
          foreignField: '_id',
          as: 'module'
        }
      },
      { $unwind: '$module' },
      ...(moduleType ? [{ $match: { 'module.type': moduleType } }] : []),
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: 1,
          userName: '$user.name',
          userSchool: '$user.school',
          userGrade: '$user.grade',
          userDistrict: '$user.profile.district',
          moduleTitle: '$module.title',
          moduleType: '$module.type',
          moduleDifficulty: '$module.difficulty',
          score: 1,
          timeSpent: 1,
          completedAt: 1,
          attempts: 1
        }
      }
    ]);

    // Calculate preparedness scores
    const preparednessReport = users.map(user => {
      const userProgress = progressData.filter(p => p.userId.toString() === user._id.toString());

      const totalModules = userProgress.length;
      const averageScore = totalModules > 0
        ? Math.round(userProgress.reduce((sum, p) => sum + p.score, 0) / totalModules)
        : 0;

      const modulesByType = userProgress.reduce((acc, p) => {
        if (!acc[p.moduleType]) acc[p.moduleType] = [];
        acc[p.moduleType].push(p);
        return acc;
      }, {});

      const typeScores = Object.keys(modulesByType).map(type => ({
        type,
        averageScore: Math.round(
          modulesByType[type].reduce((sum, p) => sum + p.score, 0) / modulesByType[type].length
        ),
        moduleCount: modulesByType[type].length
      }));

      // Calculate preparedness level
      let preparednessLevel = 'Beginner';
      if (averageScore >= 90 && totalModules >= 5) preparednessLevel = 'Expert';
      else if (averageScore >= 80 && totalModules >= 3) preparednessLevel = 'Advanced';
      else if (averageScore >= 70 && totalModules >= 2) preparednessLevel = 'Intermediate';

      return {
        userId: user._id,
        name: user.name,
        school: user.school,
        grade: user.grade,
        district: user.profile?.district,
        completedModules: totalModules,
        averageScore,
        preparednessLevel,
        typeScores,
        lastActivity: totalModules > 0
          ? userProgress.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0].completedAt
          : null
      };
    });

    // Sort by preparedness score
    preparednessReport.sort((a, b) => b.averageScore - a.averageScore);

    res.status(200).json({
      success: true,
      count: preparednessReport.length,
      filters: { school, grade, district, moduleType },
      data: preparednessReport
    });

  } catch (error) {
    console.error('Get preparedness scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching preparedness scores'
    });
  }
};

// @desc    Export data (CSV format)
// @route   GET /api/admin/export/:type
// @access  Private (Admin)
export const exportData = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { format = 'json' } = req.query;

    const isTeacher = (req as any).user.role === 'teacher';
    const schoolName = (req as any).user.school;

    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        const userQuery: any = { isActive: true };
        if (isTeacher) userQuery.school = schoolName;

        data = await User.find(userQuery)
          .populate('badges', 'name')
          .select('-password')
          .lean();
        filename = 'users_export';
        break;

      case 'progress':
        const progressQuery: any = { status: 'completed' };
        if (isTeacher) {
          const schoolUserIds = (await User.find({ school: schoolName }).select('_id')).map(u => u._id);
          progressQuery.userId = { $in: schoolUserIds };
        }

        data = await UserProgress.find(progressQuery)
          .populate('userId', 'name school grade')
          .populate('moduleId', 'title type difficulty')
          .lean();
        filename = 'progress_export';
        break;

      case 'drills':
        const drillQuery: any = { isCompleted: true };
        if (isTeacher) {
          const schoolUserIds = (await User.find({ school: schoolName }).select('_id')).map(u => u._id);
          drillQuery.userId = { $in: schoolUserIds };
        }

        data = await DrillSession.find(drillQuery)
          .populate('userId', 'name school grade')
          .lean();
        filename = 'drills_export';
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvData = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.send(csvData);
    }

    res.status(200).json({
      success: true,
      type,
      count: data.length,
      timestamp: new Date().toISOString(),
      data
    });

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data'
    });
  }
};

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value).replace(/"/g, '""');
      }
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// @desc    Get all modules for admin
// @route   GET /api/admin/modules
// @access  Private (Admin)
export const getAllModulesAdmin = async (req: Request, res: Response) => {
  try {
    const modules = await DisasterModule.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    console.error('Get admin modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching modules'
    });
  }
};

// @desc    Create new module
// @route   POST /api/admin/modules
// @access  Private (Admin)
export const createModuleAdmin = async (req: Request, res: Response) => {
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

// @desc    Update module
// @route   PUT /api/admin/modules/:id
// @access  Private (Admin)
export const updateModuleAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const module = await DisasterModule.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: module
    });
  } catch (error: any) {
    console.error('Update module error:', error);

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
      message: 'Error updating module'
    });
  }
};

// @desc    Delete module
// @route   DELETE /api/admin/modules/:id
// @access  Private (Admin)
export const deleteModuleAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const module = await DisasterModule.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Delete associated user progress
    await UserProgress.deleteMany({ moduleId: id });

    // Delete the module
    await DisasterModule.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting module'
    });
  }
};

// @desc    Get all videos from all modules
// @route   GET /api/admin/videos
// @access  Private (Admin)
export const getAllVideosAdmin = async (req: Request, res: Response) => {
  try {
    const modules = await DisasterModule.find()
      .select('_id title type content.videos')
      .lean();

    // Flatten all videos from all modules
    const allVideos: any[] = [];

    modules.forEach((module: any) => {
      const videos = module.content?.videos || [];

      videos.forEach((video: any) => {
        allVideos.push({
          id: video.id,
          title: video.title,
          url: video.url,
          description: video.description,
          duration: video.duration,
          section: video.section,
          thumbnail: video.thumbnail,
          moduleId: module._id.toString(),
          moduleTitle: module.title,
          moduleType: module.type,
          isActive: video.isActive !== undefined ? video.isActive : true
        });
      });
    });

    res.status(200).json({
      success: true,
      count: allVideos.length,
      data: allVideos
    });
  } catch (error) {
    console.error('Get all videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos'
    });
  }
};

// @desc    Add video to module
// @route   POST /api/admin/videos
// @access  Private (Admin)
export const addVideoToModule = async (req: Request, res: Response) => {
  try {
    const { moduleId, title, url, description, duration, section, thumbnail } = req.body;
    const module = await DisasterModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    const newVideo = {
      id: `v${Date.now()}`,
      title,
      url,
      description,
      duration,
      section,
      thumbnail
    };

    if (!module.content) module.content = { videos: [] };
    if (!module.content.videos) module.content.videos = [];

    module.content.videos.push(newVideo as any);
    await module.save();

    res.status(200).json({
      success: true,
      message: 'Video added successfully',
      data: {
        video: newVideo
      }
    });
  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json({ success: false, message: 'Error adding video' });
  }
};

// @desc    Update video in module
// @route   PUT /api/admin/videos/:videoId
// @access  Private (Admin)
export const updateVideoInModule = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const { moduleId, title, url, description, duration, section, thumbnail } = req.body;

    const module = await DisasterModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    const videoIndex = module.content?.videos?.findIndex((v: any) => v.id === videoId);
    if (videoIndex === undefined || videoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    module.content!.videos![videoIndex] = {
      ...module.content!.videos![videoIndex],
      title,
      url,
      description,
      duration,
      section: section || module.content!.videos![videoIndex].section,
      thumbnail: thumbnail || module.content!.videos![videoIndex].thumbnail
    };

    await module.save();

    res.status(200).json({
      success: true,
      message: 'Video updated successfully'
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ success: false, message: 'Error updating video' });
  }
};

// @desc    Delete video from module
// @route   DELETE /api/admin/videos/:videoId
// @access  Private (Admin)
export const deleteVideoFromModule = async (req: Request, res: Response) => {
  try {
    // Note: This needs the moduleId to find the right module
    const { videoId } = req.params;
    const { moduleId } = req.query;

    if (!moduleId) {
      return res.status(400).json({ success: false, message: 'Module ID is required' });
    }

    const module = await DisasterModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    if (module.content?.videos) {
      module.content.videos = module.content.videos.filter((v: any) => v.id !== videoId);
      await module.save();
    }

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ success: false, message: 'Error deleting video' });
  }
};
