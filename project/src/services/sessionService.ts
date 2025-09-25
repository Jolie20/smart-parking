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
	
    // Only CRUD supported by backend final routes
};


