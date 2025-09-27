import api from '../lib/axios';
import { spotRequest,ApiResponse } from '../types';

export interface CreateSpotRequest {
    lotId: string;
    label: string;
    isAvailable?: boolean;
}

export const spotsService = {
    getAllSpots: (): Promise<spotRequest[]> =>
        api.get('/spots').then(r => r.data),
    createSpot: (payload: spotRequest): Promise<spotRequest> =>
        api.post('/spots', payload).then(r => r.data),
    updateSpot: (id: string, payload: Partial<CreateSpotRequest>): Promise<spotRequest> => 
        api.put(`/spots/${id}`, payload).then(r => r.data),
    deleteSpot: (id: string): Promise<ApiResponse<null>> =>
        api.delete(`/spots/${id}`).then(r => r.data),
    getSpotById: (id: string): Promise<spotRequest> =>
        api.get(`/spots/${id}`).then(r => r.data),
    getSpotsByLot: (lotId: string): Promise<spotRequest[]> =>
        api.get(`/lots/${lotId}/spots`).then(r => r.data),
};
