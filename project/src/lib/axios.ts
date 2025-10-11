import axios from 'axios';

const apiBaseUrl = 'https://smart-parking-3b7s.onrender.com/api';

export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const stored = localStorage.getItem('auth_token');
	console.log('API Request:', config.url, 'Token exists:', !!stored);
	if (stored) {
		config.headers = config.headers || {};
		(config.headers as Record<string, string>)['Authorization'] = `Bearer ${stored}`;
		console.log('Authorization header set:', `Bearer ${stored.substring(0, 20)}...`);
	} else {
		console.warn('No auth token found in localStorage');
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error)
);

export default api;


