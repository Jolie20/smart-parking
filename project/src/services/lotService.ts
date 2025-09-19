import api from '../lib/axios';

export const lotService = {
	list: () => api.get('/lots').then(r => r.data),
	getById: (id: string) => api.get(`/lots/${id}`).then(r => r.data),
	create: (payload: unknown) => api.post('/lots', payload).then(r => r.data),
	update: (id: string, payload: unknown) => api.put(`/lots/${id}`, payload).then(r => r.data),
	remove: (id: string) => api.delete(`/lots/${id}`).then(r => r.data),
};


