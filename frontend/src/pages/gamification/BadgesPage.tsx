import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../types';
import { gamificationService } from '../../services/gamificationService';

const BadgesPage: React.FC = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const rarityColors: Record<string, string> = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-yellow-100 text-yellow-800'
  };

  const rarityIcons: Record<string, string> = {
    common: '🥉',
    rare: '🥈',
    epic: '🥇',
    legendary: '💎'
  };

  useEffect(() => {
    const loadBadges = async () => {
      setIsLoading(true);
      try {
        // Trigger a badge check just in case new badges were earned
        await gamificationService.checkAndAwardBadges();

        const [allBadges, earned] = await Promise.all([
          gamificationService.getAllBadges(),
          gamificationService.getUserBadges()
        ]);

        // Ensure rarity exists for UI backwards compatibility
        const decoratedBadges = allBadges.map(b => ({
          ...b,
          rarity: (b as any).rarity || (b.points >= 500 ? 'legendary' : b.points >= 200 ? 'epic' : b.points >= 100 ? 'rare' : 'common')
        }));

        setBadges(decoratedBadges);
        setUserBadges(earned.map(b => b._id.toString()));
      } catch (error) {
        console.error('Failed to load badges:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBadges();
  }, []);

  const filteredBadges = selectedRarity === 'all'
    ? badges
    : badges.filter(badge => (badge as any).rarity === selectedRarity);

  const earnedBadges = badges.filter(badge => userBadges.includes(badge._id));
  const unearnedBadges = badges.filter(badge => !userBadges.includes(badge._id));

  const getBadgeProgress = (badge: Badge) => {
    const userPoints = user?.points || 0;
    const userModules = (user as any)?.completedModulesCount || 0; // if available from user context

    if (badge.criteria?.includes('1 module')) return userModules >= 1 ? 100 : (userModules / 1) * 100;
    if (badge.criteria?.includes('3 module')) return userModules >= 3 ? 100 : (userModules / 3) * 100;
    if (badge.criteria?.includes('5 module')) return userModules >= 5 ? 100 : (userModules / 5) * 100;
    if (badge.criteria?.includes('10 module')) return userModules >= 10 ? 100 : (userModules / 10) * 100;
    if (badge.criteria?.includes('1000 point')) return userPoints >= 1000 ? 100 : (userPoints / 1000) * 100;
    if (badge.criteria?.includes('500 point')) return userPoints >= 500 ? 100 : (userPoints / 500) * 100;

    return 0; // default for items we can't trivially estimate
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Badges & Achievements</h1>
          <p className="text-lg text-gray-600">
            Earn badges by completing modules, drills, and achieving milestones in your disaster preparedness journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Earned Badges</p>
                <p className="text-2xl font-semibold text-gray-900">{earnedBadges.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Badges</p>
                <p className="text-2xl font-semibold text-gray-900">{badges.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Points</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {user?.points || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round((earnedBadges.length / badges.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rarity Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedRarity('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedRarity === 'all'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Badges
            </button>
            {['common', 'rare', 'epic', 'legendary'].map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${selectedRarity === rarity
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {rarityIcons[rarity as keyof typeof rarityIcons]} {rarity}
              </button>
            ))}
          </div>
        </div>

        {/* Earned Badges */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.filter(badge => selectedRarity === 'all' || badge.rarity === selectedRarity).map((badge) => (
              <div key={badge._id} className="bg-white rounded-lg shadow-lg p-6 border-2 border-yellow-200">
                <div className="text-center">
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.name}</h3>
                  <p className="text-gray-600 mb-3">{badge.description}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full font-medium ${rarityColors[badge.rarity]}`}>
                      {rarityIcons[badge.rarity]} {badge.rarity}
                    </span>
                    <span className="text-gray-500">+{badge.points} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Badges */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unearnedBadges.filter(badge => selectedRarity === 'all' || badge.rarity === selectedRarity).map((badge) => {
              const progress = getBadgeProgress(badge);
              return (
                <div key={badge._id} className="bg-white rounded-lg shadow p-6 opacity-75">
                  <div className="text-center">
                    <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.name}</h3>
                    <p className="text-gray-600 mb-3">{badge.description}</p>
                    <p className="text-sm text-gray-500 mb-4">{badge.criteria}</p>

                    {/* Progress Bar */}
                    {progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded-full font-medium ${rarityColors[badge.rarity]}`}>
                        {rarityIcons[badge.rarity]} {badge.rarity}
                      </span>
                      <span className="text-gray-500">+{badge.points} pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🏆</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No badges found</h3>
            <p className="text-gray-600">Try adjusting your filter to see more badges.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgesPage;
