import api from '../lib/axios';

export const bookingService = {
	list: () => api.get('/bookings').then(r => r.data),
	getById: (id: string) => api.get(`/bookings/${id}`).then(r => r.data),
	create: (payload: unknown) => api.post('/bookings', payload).then(r => r.data),
	update: (id: string, payload: unknown) => api.put(`/bookings/${id}`, payload).then(r => r.data),
	cancel: (id: string) => api.delete(`/bookings/${id}`).then(r => r.data),
};


