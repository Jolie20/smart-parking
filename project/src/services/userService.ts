import api from '../lib/axios';
import { 
	User, 
	CreateUserRequest, 
	UpdateUserRequest, 
	ApiResponse, 
	PaginatedResponse 
} from '../types';

export const userService = {
	create: (payload: CreateUserRequest): Promise<User> => 
		api.post('/users', payload).then(r => r.data),
	
	list: (): Promise<User[]> => 
		api.get('/users').then(r => r.data),
	
	getById: (id: string): Promise<User> => 
		api.get(`/users/${id}`).then(r => r.data),
	
	update: (id: string, payload: UpdateUserRequest): Promise<User> => 
		api.put(`/users/${id}`, payload).then(r => r.data),
	
	remove: (id: string): Promise<ApiResponse<null>> => 
		api.delete(`/users/${id}`).then(r => r.data),
	
	getByRole: (role: string): Promise<User[]> => 
		api.get(`/users/role/${role}`).then(r => r.data),
	
	activate: (id: string): Promise<User> => 
		api.post(`/users/${id}/activate`).then(r => r.data),
	
	deactivate: (id: string): Promise<User> => 
		api.post(`/users/${id}/deactivate`).then(r => r.data),
};


