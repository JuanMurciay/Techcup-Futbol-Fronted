import apiClient from './apiClient';
import { httpGet, httpPatch, httpPost } from './http';
import type { ApprovePaymentRequestDTO, CreatePaymentRequestDTO, RejectPaymentRequestDTO } from '../types/api/payment';

export interface Payment {
  id: number;
  teamId: number;
  status: string;
  receiptUrl?: string;
  approvedBy?: string;
  comments?: string;
}

const PaymentService = {
  create: async (data: CreatePaymentRequestDTO) => {
    return httpPost<Payment, CreatePaymentRequestDTO>('/api/v1/payments', data);
  },

  uploadReceipt: async (teamId: number, file: File) => {
    const formData = new FormData();
    formData.append('teamId', String(teamId));
    formData.append('file', file);
    const res = await apiClient.post('/api/v1/payments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data as Payment;
  },

  getAll: async () => {
    return httpGet<Payment[]>('/api/v1/payments');
  },

  getById: async (id: number) => {
    return httpGet<Payment>(`/api/v1/payments/${id}`);
  },

  getByTeam: async (teamId: number) => {
    return httpGet<Payment>(`/api/v1/payments/team/${teamId}`);
  },

  approve: async (id: number, approvedBy: string) => {
    return httpPatch<unknown, ApprovePaymentRequestDTO>(`/api/v1/payments/${id}/approve`, { approvedBy });
  },

  reject: async (id: number, comments: string) => {
    return httpPatch<unknown, RejectPaymentRequestDTO>(`/api/v1/payments/${id}/reject`, { comments });
  },

  sendToReview: async (id: number) => {
    return httpPatch<unknown>(`/api/v1/payments/${id}/review`);
  },
};

export default PaymentService;
