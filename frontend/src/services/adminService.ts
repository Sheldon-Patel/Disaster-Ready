import axios from 'axios';
import { ApiResponse, DashboardAnalytics } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const adminService = {
    getAnalytics: async (): Promise<DashboardAnalytics> => {
        const response = await api.get<ApiResponse<DashboardAnalytics>>('/admin/analytics');
        return response.data.data!;
    },

    getUsers: async (params: any): Promise<any> => {
        const response = await api.get<ApiResponse<any>>('/admin/users', { params });
        return response.data.data;
    },

    getPreparednessScores: async (params: any): Promise<any[]> => {
        const response = await api.get<ApiResponse<any[]>>('/admin/preparedness-scores', { params });
        return response.data.data!;
    },

    exportData: async (type: string, format: string = 'json'): Promise<any> => {
        const response = await api.get(`/admin/export/${type}?format=${format}`, {
            responseType: format === 'csv' ? 'blob' : 'json'
        });
        return response.data;
    }
};
