import api from '../lib/axios';
import { sportRequest,ApiResponse } from '../types';

export interface CreateSpotRequest {
    lotId: string;
    label: string;
    isAvailable?: boolean;
}

export const spotsService = {
    getAllSpots: (): Promise<sportRequest[]> =>
        api.get('/spots').then(r => r.data),
    createSpot: (payload: sportRequest): Promise<sportRequest> =>
        api.post('/spots', payload).then(r => r.data),
    updateSpot: (id: string, payload: Partial<CreateSpotRequest>): Promise<sportRequest> => 
        api.put(`/spots/${id}`, payload).then(r => r.data),
    deleteSpot: (id: string): Promise<ApiResponse<null>> =>
        api.delete(`/spots/${id}`).then(r => r.data),
    getSpotById: (id: string): Promise<sportRequest> =>
        api.get(`/spots/${id}`).then(r => r.data),
    getSpotsByLot: (lotId: string): Promise<sportRequest[]> =>
        api.get(`/lots/${lotId}/spots`).then(r => r.data),
};
