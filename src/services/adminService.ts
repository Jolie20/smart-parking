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
    
    // The following endpoints are not provided by backend; removed to prevent 404s
};


