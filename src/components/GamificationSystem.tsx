/**
 * Gamification System Component
 * Achievement badges, XP points, streaks, and leaderboards
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'profile' | 'applications' | 'networking' | 'learning';
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalXP: number;
  streak: number;
  rank: number;
  totalUsers: number;
  badges: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  badges: number;
}

interface GamificationSystemProps {
  className?: string;
}

const GamificationSystem: React.FC<GamificationSystemProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard'>('overview');
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [animatedXP, setAnimatedXP] = useState(0);

  // Mock user stats
  const userStats: UserStats = {
    level: 12,
    xp: 2450,
    xpToNext: 550,
    totalXP: 12450,
    streak: 7,
    rank: 156,
    totalUsers: 50000,
    badges: 15
  };

  // Mock achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Profile Master',
      description: 'Complete your profile 100%',
      icon: '👤',
      category: 'profile',
      points: 100,
      unlocked: true,
      progress: 100,
      maxProgress: 100,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Application Streak',
      description: 'Apply to 5 jobs in a week',
      icon: '🔥',
      category: 'applications',
      points: 250,
      unlocked: true,
      progress: 5,
      maxProgress: 5,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Network Builder',
      description: 'Connect with 50 professionals',
      icon: '🤝',
      category: 'networking',
      points: 500,
      unlocked: false,
      progress: 32,
      maxProgress: 50,
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Skill Collector',
      description: 'Add 20 skills to your profile',
      icon: '🎯',
      category: 'learning',
      points: 200,
      unlocked: true,
      progress: 20,
      maxProgress: 20,
      rarity: 'common'
    },
    {
      id: '5',
      title: 'Interview Ace',
      description: 'Complete 10 practice interviews',
      icon: '🎤',
      category: 'learning',
      points: 750,
      unlocked: false,
      progress: 3,
      maxProgress: 10,
      rarity: 'legendary'
    },
    {
      id: '6',
      title: 'Early Bird',
      description: 'Apply within 24h of job posting',
      icon: '🐦',
      category: 'applications',
      points: 150,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      rarity: 'rare'
    }
  ];

  // Mock leaderboard
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Alex Chen', avatar: '👨‍💻', level: 25, xp: 45000, badges: 42 },
    { rank: 2, name: 'Sarah Kim', avatar: '👩‍💼', level: 23, xp: 38500, badges: 38 },
    { rank: 3, name: 'Mike Johnson', avatar: '👨‍🎨', level: 22, xp: 35200, badges: 35 },
    { rank: 4, name: 'Emma Davis', avatar: '👩‍🔬', level: 21, xp: 32800, badges: 31 },
    { rank: 5, name: 'You', avatar: '🎯', level: userStats.level, xp: userStats.totalXP, badges: userStats.badges },
  ];

  // Animate XP counter
  useEffect(() => {
    let start = 0;
    const end = userStats.xp;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedXP(end);
        clearInterval(timer);
      } else {
        setAnimatedXP(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [userStats.xp]);

  // Simulate new achievement unlock
  useEffect(() => {
    const timer = setTimeout(() => {
      const unlockedAchievement = achievements.find(a => a.id === '2');
      if (unlockedAchievement) {
        setNewAchievement(unlockedAchievement);
        setTimeout(() => setNewAchievement(null), 4000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profile': return '👤';
      case 'applications': return '📝';
      case 'networking': return '🤝';
      case 'learning': return '📚';
      default: return '🏆';
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* New Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-2xl border-2 border-yellow-300"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-2xl"
              >
                🏆
              </motion.div>
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm opacity-90">{newAchievement.title}</div>
                <div className="text-xs opacity-75">+{newAchievement.points} XP</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Career Progress</h3>
            <p className="text-gray-600">Level up your job search journey</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'leaderboard', label: 'Leaderboard', icon: '👑' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-yellow-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Level Progress */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Level {userStats.level}</h4>
                    <p className="text-gray-600">Career Explorer</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">{animatedXP.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">XP</div>
                  </div>
                </div>

                {/* XP Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress to Level {userStats.level + 1}</span>
                    <span>{userStats.xp}/{userStats.xp + userStats.xpToNext} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {userStats.xpToNext} XP needed for next level
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Current Streak', value: `${userStats.streak} days`, icon: '🔥', color: 'from-red-500 to-orange-500' },
                  { label: 'Global Rank', value: `#${userStats.rank.toLocaleString()}`, icon: '🏆', color: 'from-yellow-500 to-orange-500' },
                  { label: 'Badges Earned', value: userStats.badges, icon: '🎖️', color: 'from-purple-500 to-pink-500' },
                  { label: 'Total XP', value: userStats.totalXP.toLocaleString(), icon: '⭐', color: 'from-blue-500 to-cyan-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 text-center hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-3`}>
                      {stat.icon}
                    </div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Achievements */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} p-4 rounded-xl text-white`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <div className="font-semibold">{achievement.title}</div>
                          <div className="text-sm opacity-90">+{achievement.points} XP</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">All Achievements</h4>
                <div className="text-sm text-gray-500">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative bg-white rounded-xl p-6 border-2 ${getRarityBorder(achievement.rarity)} ${
                      achievement.unlocked ? 'shadow-lg' : 'opacity-60'
                    } transition-all duration-300 hover:shadow-xl`}
                  >
                    {/* Rarity Indicator */}
                    <div className={`absolute top-2 right-2 px-2 py-1 bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white text-xs font-bold rounded-full`}>
                      {achievement.rarity}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{achievement.title}</h5>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} h-2 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{getCategoryIcon(achievement.category)} {achievement.category}</span>
                          <span className="font-semibold text-yellow-600">+{achievement.points} XP</span>
                        </div>
                      </div>
                    </div>

                    {achievement.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Global Leaderboard</h4>
                <div className="text-sm text-gray-500">Top performers this month</div>
              </div>

              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                      entry.name === 'You' 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-lg' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                      entry.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' :
                      entry.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {entry.rank <= 3 ? (
                        entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        entry.rank
                      )}
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex-1 flex items-center gap-3">
                      <div className="text-2xl">{entry.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{entry.name}</div>
                        <div className="text-sm text-gray-600">Level {entry.level}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{entry.xp.toLocaleString()} XP</div>
                      <div className="text-sm text-gray-600">{entry.badges} badges</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Your Rank */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-lg font-semibold text-gray-900">Your Global Rank</div>
                  <div className="text-3xl font-bold text-blue-600">#{userStats.rank.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">out of {userStats.totalUsers.toLocaleString()} users</div>
                  <div className="mt-4 text-sm text-gray-600">
                    Keep earning XP to climb the leaderboard! 🚀
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GamificationSystem;