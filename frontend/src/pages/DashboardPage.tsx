import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalPoints: number;
  badgesEarned: number;
  leaderboardRank: number | null;
}

interface RecentActivity {
  id: string;
  type: 'module_completed' | 'module_started' | 'badge_earned';
  title: string;
  subtitle: string;
  points: number;
  timestamp: Date;
}

interface InProgressModule {
  id: string;
  title: string;
  type: string;
  score: number;
}

const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalModules: 0,
    completedModules: 0,
    inProgressModules: 0,
    totalPoints: 0,
    badgesEarned: 0,
    leaderboardRank: null,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [inProgressModules, setInProgressModules] = useState<InProgressModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Fetch all data in parallel
      const [profileRes, progressRes, modulesRes, leaderboardRes] = await Promise.all([
        fetch(`${API_BASE}/auth/profile`, { headers }),
        fetch(`${API_BASE}/modules/progress/my`, { headers }),
        fetch(`${API_BASE}/modules?limit=100`, { headers }),
        fetch(`${API_BASE}/gamification/leaderboard?limit=100`, { headers }),
      ]);

      // Parse responses even if not ok to see the error messages
      const profileData = await profileRes.json().catch(() => null);
      const progressData = await progressRes.json().catch(() => null);
      const modulesData = await modulesRes.json().catch(() => null);
      const leaderboardData = await leaderboardRes.json().catch(() => null);

      console.log('--- FETCH STATUSES ---');
      console.log('Token exists:', !!token);
      console.log('Profile:', profileRes.status, profileData);
      console.log('Progress:', progressRes.status, progressData);
      console.log('Modules:', modulesRes.status, modulesData);
      console.log('Leaderboard:', leaderboardRes.status, leaderboardData);

      if (!profileRes.ok || !progressRes.ok) {
        throw new Error('API returned an error status');
      }

      // --- Stats ---
      const freshUser = profileData?.data;
      const allProgress: any[] = progressData?.data || [];
      const totalModules: number = modulesData?.total || modulesData?.count || modulesData?.data?.length || 0;

      console.log('--- DASHBOARD DATA DEBUG ---');
      console.log('freshUser:', freshUser);
      console.log('allProgress length:', allProgress.length);
      console.log('allProgress status counts:', {
        completed: allProgress.filter(p => p.status === 'completed').length,
        in_progress: allProgress.filter(p => p.status === 'in_progress').length,
        raw: allProgress
      });
      console.log('leaderboard data length:', leaderboardData?.data?.length);

      const completedProgress = allProgress.filter((p) => p.status === 'completed');
      const inProgressList = allProgress.filter((p) => p.status === 'in_progress');

      // Leaderboard rank: find current user
      let rank: number | null = null;
      if (leaderboardData?.data) {
        const currentUserId = freshUser?._id?.toString() || user?._id?.toString() || (user as any)?.id?.toString();
        console.log('Looking for User ID in leaderboard:', currentUserId);
        const entry = leaderboardData.data.find(
          (e: any) => e.userId?.toString() === currentUserId || e._id?.toString() === currentUserId
        );
        console.log('Found Leaderboard Entry:', entry);
        if (entry) rank = entry.rank || null;
      }
      console.log('--- END DEBUG ---');

      setStats({
        totalModules,
        completedModules: completedProgress.length,
        inProgressModules: inProgressList.length,
        totalPoints: freshUser?.points ?? user?.points ?? 0,
        badgesEarned: freshUser?.badges?.length ?? user?.badges?.length ?? 0,
        leaderboardRank: rank,
      });

      // --- In-progress modules (show up to 3) ---
      setInProgressModules(
        inProgressList.slice(0, 3).map((p: any) => ({
          id: p.moduleId?._id || p.moduleId,
          title: p.moduleId?.title || 'Unknown Module',
          type: p.moduleId?.type || '',
          score: p.score || 0,
        }))
      );

      // --- Recent activity ---
      const activity: RecentActivity[] = [];

      // Add completed modules to activity
      completedProgress.slice(0, 5).forEach((p: any) => {
        activity.push({
          id: p._id || `prog-${Math.random()}`,
          type: 'module_completed',
          title: `Completed: ${p.moduleId?.title || 'Module'}`,
          subtitle: `Score: ${p.score || 100}%`,
          points: p.moduleId?.totalQuizPoints || p.score || 100, // Approximate points if not populated
          timestamp: new Date(p.updatedAt || p.completedAt || Date.now()),
        });
      });

      // Add badge activity
      const badges: any[] = freshUser?.badges || user?.badges || [];
      badges.slice(0, 3).forEach((badge: any, i: number) => {
        activity.push({
          id: badge._id || `badge-${i}`,
          type: 'badge_earned',
          title: `Badge earned: ${badge.name || 'Achievement'}`,
          subtitle: badge.description || 'Great job!',
          points: badge.points || 0,
          timestamp: new Date(badge.earnedAt || badge.createdAt || Date.now()),
        });
      });

      // Sort combined activity by timestamp desc
      activity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setRecentActivity(activity.slice(0, 6));

    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user, fetchDashboardData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'teacher':
        return {
          description: 'Manage your students and educational content',
          primaryAction: { text: 'Teacher Panel', link: '/teacher' },
          secondaryAction: { text: 'Create Drill', link: '/drills' },
        };
      default:
        return {
          description: 'Continue your disaster preparedness education',
          primaryAction: { text: 'Start Learning', link: '/modules' },
          secondaryAction: { text: 'Practice Drills', link: '/drills' },
        };
    }
  };

  const content = getRoleSpecificContent();

  const progressPct =
    stats.totalModules > 0 ? Math.round((stats.completedModules / stats.totalModules) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600">{content.description}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
            title="Refresh dashboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Modules */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center mb-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.completedModules}<span className="text-base font-normal text-gray-400">/{stats.totalModules}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Modules Completed</p>
            {/* Progress bar */}
            <div className="mt-2 bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{progressPct}% complete</p>
          </div>

          {/* Points */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center mb-3">
              <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total Points</p>
            <p className="text-xs text-yellow-600 mt-2 font-medium">
              {stats.totalPoints >= 1000 ? '🏆 Champion!' : `${1000 - stats.totalPoints} pts to Champion`}
            </p>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center mb-3">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.badgesEarned}</p>
            <p className="text-sm text-gray-500 mt-1">Badges Earned</p>
            <Link to="/badges" className="text-xs text-purple-600 hover:underline mt-2 block">
              View all badges →
            </Link>
          </div>

          {/* Leaderboard Rank */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center mb-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.leaderboardRank ? `#${stats.leaderboardRank}` : '—'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Global Rank</p>
            <Link to="/leaderboard" className="text-xs text-green-600 hover:underline mt-2 block">
              View leaderboard →
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Quick Actions + In Progress */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to={content.primaryAction.link}
                  className="flex items-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-700 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{content.primaryAction.text}</p>
                    <p className="text-sm text-gray-500">Continue your learning journey</p>
                  </div>
                </Link>

                <Link
                  to={content.secondaryAction.link}
                  className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{content.secondaryAction.text}</p>
                    <p className="text-sm text-gray-500">Practice and improve</p>
                  </div>
                </Link>

                <Link
                  to="/leaderboard"
                  className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">Leaderboard</p>
                    <p className="text-sm text-gray-500">
                      {stats.leaderboardRank ? `You're ranked #${stats.leaderboardRank}` : 'See how you rank'}
                    </p>
                  </div>
                </Link>

                <Link
                  to="/badges"
                  className="flex items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:bg-yellow-600 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">Your Badges</p>
                    <p className="text-sm text-gray-500">{stats.badgesEarned} badge{stats.badgesEarned !== 1 ? 's' : ''} earned</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* In Progress Modules */}
            {inProgressModules.length > 0 && (
              <div className="bg-white rounded-xl shadow">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
                  <Link to="/modules" className="text-sm text-red-600 hover:text-red-700 font-medium">
                    All modules →
                  </Link>
                </div>
                <div className="p-6 space-y-3">
                  {inProgressModules.map((mod) => (
                    <Link
                      key={mod.id}
                      to={`/modules/${mod.id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors group"
                    >
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-red-700 transition-colors">{mod.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{mod.type}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                        In Progress
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow h-full">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No activity yet.</p>
                    <Link to="/modules" className="text-red-600 text-sm hover:underline mt-1 block">
                      Start a module →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const colors = {
                        module_completed: { bg: 'bg-green-100', text: 'text-green-600' },
                        module_started: { bg: 'bg-blue-100', text: 'text-blue-600' },
                        badge_earned: { bg: 'bg-purple-100', text: 'text-purple-600' },
                      };
                      const color = colors[activity.type];

                      return (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color.bg}`}>
                            <svg className={`w-4 h-4 ${color.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {activity.type === 'badge_earned' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                              )}
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.subtitle}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {activity.timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          {activity.points > 0 && (
                            <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                              +{activity.points} pts
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link to="/profile" className="text-sm text-red-600 hover:text-red-700 font-medium">
                    View full profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
