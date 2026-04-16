import apiClient from './apiClient';
import type { Match } from '../types';

export interface RefereeUser {
  id: number;
  fullName: string;
  email: string;
  licenseNumber?: string;
}

const RefereeService = {
  getAll: async () => {
    const res = await apiClient.get<RefereeUser[]>('/api/v1/referees');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<RefereeUser>(`/api/v1/referees/${id}`);
    return res.data;
  },

  getMatches: async (id: number) => {
    const res = await apiClient.get<Match[]>(`/api/v1/referees/${id}/matches`);
    return res.data;
  },
};

export default RefereeService;
