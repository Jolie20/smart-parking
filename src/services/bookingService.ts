import api from '../lib/axios';
import { 
	Booking, 
	CreateBookingRequest, 
	UpdateBookingRequest, 
	ApiResponse
} from '../types';

export const bookingService = {
	list: (): Promise<Booking[]> => 
		api.get('/bookings').then(r => r.data),
	
	getById: (id: string): Promise<Booking> => 
		api.get(`/bookings/${id}`).then(r => r.data),
	
	create: (payload: CreateBookingRequest): Promise<Booking> => 
		api.post('/bookings', payload).then(r => r.data),
	
	update: (id: string, payload: UpdateBookingRequest): Promise<Booking> => 
		api.put(`/bookings/${id}`, payload).then(r => r.data),
	
	cancel: (id: string): Promise<ApiResponse<null>> => 
		api.delete(`/bookings/${id}`).then(r => r.data),
	
    // Additional filters not supported by backend in final routes
};


