import apiClient from './apiClient';
import type { Match, MatchEvent } from '../types';

const MatchService = {
  getAll: async () => {
    const res = await apiClient.get<Match[]>('/api/v1/matches');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<Match>(`/api/v1/matches/${id}`);
    return res.data;
  },

  getEvents: async (id: number) => {
    const res = await apiClient.get<MatchEvent[]>(`/api/v1/matches/${id}/events`);
    return res.data;
  },

  registerResult: async (id: number, data: { homeGoals: number; awayGoals: number }) => {
    const res = await apiClient.patch(`/api/v1/matches/${id}/result`, data);
    return res.data;
  },

  registerEvent: async (id: number, data: { type: string; playerId: number; minute: number }) => {
    const res = await apiClient.post(`/api/v1/matches/${id}/events`, data);
    return res.data;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await apiClient.patch(`/api/v1/matches/${id}/status`, { status });
    return res.data;
  },
};

export default MatchService;
