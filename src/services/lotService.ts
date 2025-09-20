import api from '../lib/axios';
import { 
	ParkingLot, 
	CreateLotRequest, 
	UpdateLotRequest, 
	ApiResponse
} from '../types';

export const lotService = {
	list: (): Promise<ParkingLot[]> => 
		api.get('/lots').then(r => r.data),
	
	getById: (id: string): Promise<ParkingLot> => 
		api.get(`/lots/${id}`).then(r => r.data),
	
	create: (payload: CreateLotRequest): Promise<ParkingLot> => 
		api.post('/lots', payload).then(r => r.data),
	
	update: (id: string, payload: UpdateLotRequest): Promise<ParkingLot> => 
		api.put(`/lots/${id}`, payload).then(r => r.data),
	
	remove: (id: string): Promise<ApiResponse<null>> => 
		api.delete(`/lots/${id}`).then(r => r.data),
	
	getByManagerId: (managerId: string): Promise<ParkingLot[]> => 
		api.get(`/lots/manager/${managerId}`).then(r => r.data),
	
	getAvailable: (): Promise<ParkingLot[]> => 
		api.get('/lots/available').then(r => r.data),
	
	updateAvailability: (id: string, availableSpots: number): Promise<ParkingLot> => 
		api.patch(`/lots/${id}/availability`, { availableSpots }).then(r => r.data),
};


