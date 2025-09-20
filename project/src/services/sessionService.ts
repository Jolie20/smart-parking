import api from '../lib/axios';
import { 
	ParkingSession
} from '../types';

export interface CheckInRequest {
	vehicleId: string;
	lotId: string;
	spotId: string;
	bookingId?: string;
	checkInMethod: 'rfid' | 'qr_code' | 'mobile_app' | 'manual';
}

export const sessionService = {
	list: (): Promise<ParkingSession[]> => 
		api.get('/sessions').then(r => r.data),
	
	getById: (id: string): Promise<ParkingSession> => 
		api.get(`/sessions/${id}`).then(r => r.data),
	
	checkIn: (payload: CheckInRequest): Promise<ParkingSession> => 
		api.post('/sessions/checkin', payload).then(r => r.data),
	
	checkOut: (id: string, checkOutMethod?: string): Promise<ParkingSession> => 
		api.post(`/sessions/${id}/checkout`, { checkOutMethod }).then(r => r.data),
	
	getActive: (): Promise<ParkingSession[]> => 
		api.get('/sessions/active').then(r => r.data),
	
	getByUserId: (userId: string): Promise<ParkingSession[]> => 
		api.get(`/sessions/user/${userId}`).then(r => r.data),
	
	getByLotId: (lotId: string): Promise<ParkingSession[]> => 
		api.get(`/sessions/lot/${lotId}`).then(r => r.data),
	
	getByVehicleId: (vehicleId: string): Promise<ParkingSession[]> => 
		api.get(`/sessions/vehicle/${vehicleId}`).then(r => r.data),
};


