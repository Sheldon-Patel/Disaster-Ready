import axios from 'axios';
import { DisasterModule, ApiResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'https://disaster-readydisaster-ready-backend.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ModuleService {
  async getAllModules(): Promise<DisasterModule[]> {
    try {
      const response = await api.get<ApiResponse<DisasterModule[]>>('/modules');

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch modules');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch modules');
    }
  }

  async getModuleById(id: string): Promise<DisasterModule> {
    try {
      const response = await api.get<ApiResponse<DisasterModule>>(`/modules/${id}`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch module');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch module');
    }
  }

  async getModulesByType(type: string): Promise<DisasterModule[]> {
    try {
      const response = await api.get<ApiResponse<DisasterModule[]>>(`/modules?type=${type}`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch modules');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch modules');
    }
  }

  async getModulesByDifficulty(difficulty: string): Promise<DisasterModule[]> {
    try {
      const response = await api.get<ApiResponse<DisasterModule[]>>(`/modules?difficulty=${difficulty}`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch modules');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch modules');
    }
  }

  async rateModule(id: string, rating: number): Promise<void> {
    try {
      await api.post(`/modules/${id}/rate`, { rating });
    } catch (error: any) {
      // Rating failures are non-critical, log and continue
      console.warn('Rating submission failed (non-critical):', error?.response?.data?.message || error.message);
    }
  }

  async startModule(id: string): Promise<any> {
    try {
      const response = await api.post(`/modules/${id}/start`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to start module');
      }
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to start module');
    }
  }

  async submitQuiz(id: string, answers: Record<string, any>, timeSpent: number, clientResults?: any): Promise<any> {
    try {
      const response = await api.post(`/modules/${id}/submit-quiz`, { answers, timeSpent, clientResults });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to submit quiz');
      }
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to submit quiz');
    }
  }

  async getUserProgress(moduleId: string): Promise<number> {
    try {
      const response = await api.get('/modules/progress/my');
      if (response.data.success && response.data.data) {
        // Find the progress record specifically for this module
        const progressRecord = response.data.data.find(
          (record: any) => {
            const recordModuleId = record.moduleId?._id?.toString() || record.moduleId?.toString() || '';
            return recordModuleId === moduleId;
          }
        );

        if (progressRecord) {
          // If the record exists, check status
          return progressRecord.status === 'completed' ? 100 : (progressRecord.score || 0);
        }
      }
      return 0;
    } catch {
      return 0;
    }
  }
}

export const moduleService = new ModuleService();
