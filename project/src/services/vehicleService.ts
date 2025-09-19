import api from '../lib/axios';

export const vehicleService = {
	list: () => api.get('/vehicles').then(r => r.data),
	getById: (id: string) => api.get(`/vehicles/${id}`).then(r => r.data),
	create: (payload: unknown) => api.post('/vehicles', payload).then(r => r.data),
	update: (id: string, payload: unknown) => api.put(`/vehicles/${id}`, payload).then(r => r.data),
	remove: (id: string) => api.delete(`/vehicles/${id}`).then(r => r.data),
};


