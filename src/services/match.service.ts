import type { Match, MatchEvent } from '../types';
import { httpGet, httpPatch, httpPost } from './http';
import type { RegisterEventRequestDTO, RegisterResultRequestDTO, UpdateMatchStatusRequestDTO } from '../types/api/match';

const MatchService = {
  getAll: async () => {
    return httpGet<Match[]>('/api/v1/matches');
  },

  getById: async (id: number) => {
    return httpGet<Match>(`/api/v1/matches/${id}`);
  },

  getEvents: async (id: number) => {
    return httpGet<MatchEvent[]>(`/api/v1/matches/${id}/events`);
  },

  registerResult: async (id: number, data: RegisterResultRequestDTO) => {
    return httpPatch<unknown, RegisterResultRequestDTO>(`/api/v1/matches/${id}/result`, data);
  },

  registerEvent: async (id: number, data: RegisterEventRequestDTO) => {
    return httpPost<unknown, RegisterEventRequestDTO>(`/api/v1/matches/${id}/events`, data);
  },

  updateStatus: async (id: number, status: string) => {
    return httpPatch<unknown, UpdateMatchStatusRequestDTO>(`/api/v1/matches/${id}/status`, { status });
  },
};

export default MatchService;
