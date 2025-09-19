import api from '../lib/axios';

export const adminService = {
	stats: () => api.get('/admin/stats').then(r => r.data),
	listUsers: () => api.get('/admin/users').then(r => r.data),
	createManager: (payload: unknown) => api.post('/admin/managers', payload).then(r => r.data),
	getManagers: () => api.get('/admin/managers').then(r => r.data),
	assignManagerToLot: (payload: unknown) => api.post('/admin/assign-manager', payload).then(r => r.data),
};


