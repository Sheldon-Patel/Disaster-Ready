import api from './api';
import { LeaderboardEntry, Badge } from '../types';

export const gamificationService = {
    // Get global leaderboard
    getLeaderboard: async (limit: number = 50, school?: string, grade?: number): Promise<LeaderboardEntry[]> => {
        try {
            const params = new URLSearchParams();
            params.append('limit', limit.toString());
            if (school) params.append('school', school);
            if (grade) params.append('grade', grade.toString());

            const response = await api.get(`/gamification/leaderboard?${params.toString()}`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    },

    // Get school leaderboard
    getSchoolLeaderboard: async (school: string, limit: number = 50, grade?: number): Promise<LeaderboardEntry[]> => {
        try {
            const params = new URLSearchParams();
            params.append('limit', limit.toString());
            if (grade) params.append('grade', grade.toString());

            const response = await api.get(`/gamification/leaderboard/school/${encodeURIComponent(school)}?${params.toString()}`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching school leaderboard:', error);
            return [];
        }
    },

    // Get user badges
    getUserBadges: async (): Promise<Badge[]> => {
        try {
            const response = await api.get('/gamification/my-badges');
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching user badges:', error);
            return [];
        }
    },

    // Check and award new badges
    checkAndAwardBadges: async (): Promise<any> => {
        try {
            const response = await api.post('/gamification/check-badges');
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error checking badges:', error);
            return null;
        }
    },

    // Get all available badges
    getAllBadges: async (): Promise<Badge[]> => {
        try {
            const response = await api.get('/gamification/badges');
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching all badges:', error);
            return [];
        }
    }
};
