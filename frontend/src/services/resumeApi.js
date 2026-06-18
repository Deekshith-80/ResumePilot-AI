import api from './axios';

export const resumeApi = {
  upload: (formData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data),
  history: () => api.get('/resume/history').then((res) => res.data),
  getById: (id) => api.get(`/resume/${id}`).then((res) => res.data),
  delete: (id) => api.delete(`/resume/${id}`).then((res) => res.data),
  analyze: (formData) =>
    api.post('/ats/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data),
  optimize: (formData) =>
    api.post('/ats/optimize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data),
  coverLetter: (payload) => api.post('/ats/generate-cover-letter', payload).then((res) => res.data),
  exportDocument: (payload) =>
    api
      .post('/ats/export', payload, {
        responseType: 'blob'
      })
      .then((res) => res)
};
