import api from '../lib/axios';

export const managerService = {
	getLots: () => api.get('/manager/lots').then(r => r.data),
	getSessions: () => api.get('/manager/sessions').then(r => r.data),
};


