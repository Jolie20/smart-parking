import api from '../lib/axios';
import { 
	User, 
	Manager, 
	Analytics, 
	AdminDashboardData,
	DashboardStats,
	CreateUserRequest,
	ApiResponse 
} from '../types';

export interface CreateManagerRequest {
	email: string;
	username: string;
	phone?: string;
	password: string;
}

export interface AssignManagerRequest {
	managerId: string;
	lotId: string;
}

export const adminService = {
	stats: (): Promise<DashboardStats> => 
		api.get('/admin/stats').then(r => r.data),
	
	listUsers: (): Promise<User[]> => 
		api.get('/admin/users').then(r => r.data),
	
	createManager: (payload: CreateManagerRequest): Promise<Manager> => 
		api.post('/admin/managers', payload).then(r => r.data),
	
	getManagers: (): Promise<Manager[]> => 
		api.get('/admin/managers').then(r => r.data),
	
	assignManagerToLot: (payload: AssignManagerRequest): Promise<ApiResponse<null>> => 
		api.post('/admin/assign-manager', payload).then(r => r.data),
	
	getDashboardData: (): Promise<AdminDashboardData> => 
		api.get('/admin/dashboard').then(r => r.data),
	
	getAnalytics: (): Promise<Analytics> => 
		api.get('/admin/analytics').then(r => r.data),
	
	createUser: (payload: CreateUserRequest): Promise<User> => 
		api.post('/admin/users', payload).then(r => r.data),
	
	updateUser: (id: string, payload: any): Promise<User> => 
		api.put(`/admin/users/${id}`, payload).then(r => r.data),
	
	deleteUser: (id: string): Promise<ApiResponse<null>> => 
		api.delete(`/admin/users/${id}`).then(r => r.data),
};


