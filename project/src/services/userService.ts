import api from '../lib/axios';
import { 
	User, 
	CreateUserRequest, 
	UpdateUserRequest, 
	ApiResponse
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
	userVehicls: (): Promise<any> => 
		api.get('/users/myvehicle').then(r => r.data),
	
	
    // The following endpoints are not supported by backend routes; remove or implement when available
};


