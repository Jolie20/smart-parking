import api from '../lib/axios';

export const sessionService = {
	list: () => api.get('/sessions').then(r => r.data),
	getById: (id: string) => api.get(`/sessions/${id}`).then(r => r.data),
	checkIn: (payload: unknown) => api.post('/sessions/checkin', payload).then(r => r.data),
	checkOut: (id: string) => api.post(`/sessions/${id}/checkout`).then(r => r.data),
};


