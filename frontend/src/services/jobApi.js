import api from './axios';

export const jobApi = {
  jobs: (params = {}) => api.get('/jobs', { params }).then((res) => res.data),
  matches: () => api.get('/jobs/matches').then((res) => res.data),
  job: (id) => api.get(`/jobs/${id}`).then((res) => res.data),
  apply: (payload) => api.post('/jobs/apply', payload).then((res) => res.data)
};

