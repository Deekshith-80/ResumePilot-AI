import api from './axios';

export const profileApi = {
  get: () => api.get('/profile').then((res) => res.data),
  update: (formData) =>
    api.put('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data),
  stats: () => api.get('/profile/stats').then((res) => res.data),
  theme: (payload) => api.put('/settings/theme', payload).then((res) => res.data),
  password: (payload) => api.put('/settings/password', payload).then((res) => res.data),
  logout: () => api.post('/settings/logout').then((res) => res.data),
  deleteAccount: () => api.delete('/settings/delete-account').then((res) => res.data)
};
