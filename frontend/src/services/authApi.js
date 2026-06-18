import api from './axios';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  deleteAccount: () => api.delete('/auth/delete-account').then((res) => res.data)
};

