import api from '../lib/axios';
import { 
	Vehicle, 
	CreateVehicleRequest, 
	UpdateVehicleRequest, 
	ApiResponse
} from '../types';

export const vehicleService = {
	list: (): Promise<Vehicle[]> => 
		api.get('/vehicles').then(r => r.data),
	
	getById: (id: string): Promise<Vehicle> => 
		api.get(`/vehicles/${id}`).then(r => r.data),
	
	create: (payload: CreateVehicleRequest): Promise<Vehicle> => 
		api.post('/vehicles', payload).then(r => r.data),
	
	update: (id: string, payload: UpdateVehicleRequest): Promise<Vehicle> => 
		api.put(`/vehicles/${id}`, payload).then(r => r.data),
	
	remove: (id: string): Promise<ApiResponse<null>> => 
		api.delete(`/vehicles/${id}`).then(r => r.data),
	
	getByUserId: (userId: string): Promise<Vehicle[]> => 
		api.get(`/vehicles/user/${userId}`).then(r => r.data),
	
	getByLicensePlate: (licensePlate: string): Promise<Vehicle> => 
		api.get(`/vehicles/license/${licensePlate}`).then(r => r.data),
};


