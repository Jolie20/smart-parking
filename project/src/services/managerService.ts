import api from '../lib/axios';
import { 
	ParkingLot, 
	ParkingSession, 
	ManagerDashboardData,
	Booking
} from '../types';

export const managerService = {
	getLots: (): Promise<ParkingLot[]> => 
		api.get('/manager/lots').then(r => r.data),
	getSpots:(): Promise<ParkingLot[]> =>
		api.get('/spots').then(r => r.data),
	getSessions: (): Promise<ParkingSession[]> => 
		api.get('/manager/sessions').then(r => r.data),
	
	getDashboardData: (): Promise<ManagerDashboardData> => 
		api.get('/manager/dashboard').then(r => r.data),
	
	getActiveSessions: (): Promise<ParkingSession[]> => 
		api.get('/manager/sessions/active').then(r => r.data),
	
	getTodaySessions: (): Promise<ParkingSession[]> => 
		api.get('/manager/sessions/today').then(r => r.data),
	
	getLotAnalytics: (lotId: string): Promise<any> => 
		api.get(`/manager/lots/${lotId}/analytics`).then(r => r.data),
	
	updateLotAvailability: (lotId: string, availableSpots: number): Promise<ParkingLot> => 
		api.patch(`/manager/lots/${lotId}/availability`, { availableSpots }).then(r => r.data),
	
	// Booking-related methods
	getBookings: (): Promise<Booking[]> => 
		api.get('/manager/bookings').then(r => r.data),
	
	getBookingStats: (): Promise<any> => 
		api.get('/manager/stats').then(r => r.data),
};


