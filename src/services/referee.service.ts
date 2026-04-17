import type { Match } from '../types';
import { httpGet } from './http';

export interface RefereeUser {
  id: number;
  fullName: string;
  email: string;
  licenseNumber?: string;
}

const RefereeService = {
  getAll: async () => {
    return httpGet<RefereeUser[]>('/api/v1/referees');
  },

  getById: async (id: number) => {
    return httpGet<RefereeUser>(`/api/v1/referees/${id}`);
  },

  getMatches: async (id: number) => {
    return httpGet<Match[]>(`/api/v1/referees/${id}/matches`);
  },
};

export default RefereeService;
