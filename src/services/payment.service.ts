import apiClient from './apiClient';

export interface Payment {
  id: number;
  teamId: number;
  status: string;
  receiptUrl?: string;
  approvedBy?: string;
  comments?: string;
}

const PaymentService = {
  create: async (data: { teamId: number; receiptUrl?: string }) => {
    const res = await apiClient.post('/api/v1/payments', data);
    return res.data;
  },

  uploadReceipt: async (teamId: number, file: File) => {
    const formData = new FormData();
    formData.append('teamId', String(teamId));
    formData.append('file', file);
    const res = await apiClient.post('/api/v1/payments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getAll: async () => {
    const res = await apiClient.get<Payment[]>('/api/v1/payments');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<Payment>(`/api/v1/payments/${id}`);
    return res.data;
  },

  getByTeam: async (teamId: number) => {
    const res = await apiClient.get<Payment>(`/api/v1/payments/team/${teamId}`);
    return res.data;
  },

  approve: async (id: number, approvedBy: string) => {
    const res = await apiClient.patch(`/api/v1/payments/${id}/approve`, { approvedBy });
    return res.data;
  },

  reject: async (id: number, comments: string) => {
    const res = await apiClient.patch(`/api/v1/payments/${id}/reject`, { comments });
    return res.data;
  },

  sendToReview: async (id: number) => {
    const res = await apiClient.patch(`/api/v1/payments/${id}/review`);
    return res.data;
  },
};

export default PaymentService;
