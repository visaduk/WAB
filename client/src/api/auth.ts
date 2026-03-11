import api from './axios';
import type { AuthResponse } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/register', { email, password, name });
  return data;
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data.user;
}
