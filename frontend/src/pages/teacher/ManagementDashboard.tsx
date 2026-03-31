import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { DashboardAnalytics, User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';
import VideoManagement from '../../components/admin/VideoManagement';

const ManagementDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const isAdmin = user?.role === 'admin';

  const navigation = [
    { name: 'Overview', href: '/teacher', current: location.pathname === '/teacher' },
    { name: 'My Students', href: '/teacher/students', current: location.pathname === '/teacher/students' },
    ...(isAdmin ? [
      { name: 'Videos', href: '/teacher/videos', current: location.pathname === '/teacher/videos' }
    ] : [])
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {isAdmin ? 'admin' : 'teacher'} dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600 rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'Admin' : 'Teacher'} Panel
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {isAdmin
              ? 'Global system overview and disaster preparedness management'
              : `Safety Oversight for ${user?.school || 'your school'}`}
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <nav className="flex px-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`py-4 px-4 font-medium text-sm transition-all border-b-2 ${item.current
                  ? 'border-red-600 text-red-600 bg-red-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<OverviewTab analytics={analytics} isAdmin={isAdmin} />} />
          <Route path="/videos" element={<VideoManagement />} />
          <Route path="/students" element={<StudentManagement />} />
        </Routes>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ analytics: DashboardAnalytics | null; isAdmin: boolean }> = ({ analytics, isAdmin }) => {
  if (!analytics) return null;

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Modules</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalModules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Virtual Drills</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalVirtualDrills.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg School Score</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.schoolAverageScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Alerts and Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-red-900 uppercase tracking-tighter">Priority Focus Topic</p>
            <p className="text-xs text-red-700 font-medium mt-1">
              Based on recent quiz results, students are struggling most with <strong>{analytics.moduleStats.popularity.sort((a, b) => a.completionRate - b.completionRate)[0]?.title || 'Safety Protocols'}</strong>. Consider a classroom review.
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-green-900 uppercase tracking-tighter">School Safety Grade</p>
            <p className="text-xs text-green-700 font-medium mt-1">
              Your school current has a safety preparedness grade of <strong>{analytics.overview.schoolAverageScore! >= 80 ? 'A (Excellent)' : 'B (Good)'}</strong>. Keep up the regular drills!
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Rows */}
      <div className="grid grid-cols-1 gap-8">
        {/* Top Performing Students */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Performing Students</h3>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">Live</span>
          </div>
          <div className="space-y-4">
            {analytics.topStudents?.map((student, idx) => (
              <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                    idx === 1 ? 'bg-gray-200 text-gray-600' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-white text-gray-400'
                    }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">Grade {student.grade}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-red-600">{student.points} pts</p>
                  <p className="text-[10px] text-gray-400">Awarded</p>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* Top Schools - Only for Admin */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Global School Ranking</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">School</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total Points</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {analytics.topSchools.map((school, idx) => (
                  <tr key={school._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">#{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{school._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.totalStudents}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{school.totalPoints.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100">
                        {Math.round(school.averagePoints)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Student Management Component for Teachers
const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getUsers({ role: 'student' });
        setStudents(response || []);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (isLoading) return <div className="p-12 text-center text-gray-600">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
    Loading class roster...
  </div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Student Directory</h3>
          <div className="text-xs text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200">
            {students.length} Students Enrolled
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Modules Completed</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Quiz Score</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Safety Points</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Badges</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold mr-3">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">Grade {student.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-gray-900">{student.stats.completedModules}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${student.stats.averageScore >= 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${student.stats.averageScore}%` }}></div>
                      </div>
                      <span className="text-xs font-extrabold text-gray-700">{student.stats.averageScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-black rounded-lg border border-yellow-100 uppercase">
                      {student.points || 0} Points
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex -space-x-2">
                      {student.badges?.length > 0 ? student.badges.slice(0, 3).map((badge: any, i: number) => (
                        <span key={i} className="text-xl" title={badge.name}>{badge.icon}</span>
                      )) : <span className="text-xs text-gray-400">None</span>}
                      {student.badges?.length > 3 && (
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-white">
                          +{student.badges.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="p-12 text-center text-gray-500 font-medium">No students registered in your class yet.</div>
          )}
        </div>
      </div>

      {/* Student Progress Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-white/20">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 bg-red-600 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-black">{selectedStudent.name}'s Safety Report</h2>
                <p className="text-xs opacity-80 font-bold uppercase tracking-widest mt-0.5">Safety Preparedness Overview</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Average Score</p>
                  <p className="text-2xl font-black text-red-600">{selectedStudent.stats.averageScore}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Total Points</p>
                  <p className="text-2xl font-black text-yellow-600">{selectedStudent.points}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Modules Done</p>
                  <p className="text-2xl font-black text-blue-600">{selectedStudent.stats.completedModules}</p>
                </div>
              </div>

              {/* Emergency Contact & Phone */}
              <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100/50">
                <h3 className="text-xs font-black text-red-900 uppercase tracking-widest mb-4">Emergency & Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-red-100">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-red-900/50 uppercase tracking-tighter">Student Phone</p>
                      <p className="text-sm font-bold text-gray-900">{selectedStudent.phone || 'Not Provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-red-100">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-red-900/50 uppercase tracking-tighter">Emergency Contact</p>
                      <p className="text-sm font-bold text-gray-900">{selectedStudent.profile?.emergencyContact || 'Not Provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-gray-900 border-l-4 border-red-600 pl-3">Module Breakdown</h4>
                <div className="space-y-3">
                  {selectedStudent.stats.detailedProgress?.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{item.moduleTitle || 'Unknown Module'}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(item.completedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {item.status}
                        </span>
                        <span className="text-lg font-black text-gray-900">{item.score || 0}%</span>
                      </div>
                    </div>
                  ))}
                  {!selectedStudent.stats.detailedProgress?.length && (
                    <p className="text-center py-8 text-gray-400 font-bold text-xs bg-gray-50 rounded-2xl italic border-2 border-dashed border-gray-200">
                      No learning modules attempted yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                CLOSE REPORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementDashboard;
