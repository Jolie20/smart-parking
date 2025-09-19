import api from '../lib/axios';

export const userService = {
	create: (payload: unknown) => api.post('/users', payload).then(r => r.data),
	list: () => api.get('/users').then(r => r.data),
	getById: (id: string) => api.get(`/users/${id}`).then(r => r.data),
	update: (id: string, payload: unknown) => api.put(`/users/${id}`, payload).then(r => r.data),
	remove: (id: string) => api.delete(`/users/${id}`).then(r => r.data),
};


