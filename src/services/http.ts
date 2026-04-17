import apiClient from './apiClient';

export async function httpGet<T>(url: string): Promise<T> {
  const response = await apiClient.get<T>(url);
  return response.data;
}

export async function httpPost<TResponse, TRequest = unknown>(url: string, body?: TRequest): Promise<TResponse> {
  const response = await apiClient.post<TResponse>(url, body);
  return response.data;
}

export async function httpPatch<TResponse, TRequest = unknown>(url: string, body?: TRequest): Promise<TResponse> {
  const response = await apiClient.patch<TResponse>(url, body);
  return response.data;
}

export async function httpPut<TResponse, TRequest = unknown>(url: string, body?: TRequest): Promise<TResponse> {
  const response = await apiClient.put<TResponse>(url, body);
  return response.data;
}

export async function httpDelete<TResponse>(url: string): Promise<TResponse> {
  const response = await apiClient.delete<TResponse>(url);
  return response.data;
}
