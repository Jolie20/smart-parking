import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const stored = localStorage.getItem('auth_token');
	if (stored) {
		config.headers = config.headers || {};
		(config.headers as Record<string, string>)['Authorization'] = `Bearer ${stored}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error)
);

export default api;


