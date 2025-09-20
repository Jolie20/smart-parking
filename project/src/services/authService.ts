import api from '../lib/axios';

export interface LoginResponse {
	token: string;
	user: {
		id: string;
		email: string;
		role: 'user' | 'manager' | 'admin' | 'ADMIN';
		[name: string]: unknown;
	};
}

export const authService = {
	userLogin: async (email: string, password: string) => {
		const { data } = await api.post<LoginResponse>('/users/v1/login', { email, password });
		localStorage.setItem('auth_token', data.token);
		return data;
	},
	adminLogin: async (email: string, password: string) => {
		const { data } = await api.post<LoginResponse>('/admin/login', { email, password });
		localStorage.setItem('auth_token', data.token);
		return data;
	},
	managerLogin: async (email: string, password: string) => {
		const { data } = await api.post<LoginResponse>('/managers/login', { email, password });
		localStorage.setItem('auth_token', data.token);
		return data;
	},
	logout: () => {
		localStorage.removeItem('auth_token');
	},
};


