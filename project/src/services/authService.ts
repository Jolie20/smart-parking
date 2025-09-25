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
		const { data } = await api.post<LoginResponse>('/manager/login', { email, password });
		localStorage.setItem('auth_token', data.token);
		return data;
	},
    signupuser: async (email: string, name: string, password: string, phone?: string, role: string = 'user') => {
        const { data } = await api.post('/users', { email, name, password, phone, role });
        return data as any;
    },
	logout: () => {
		localStorage.removeItem('auth_token');
	},
};


