// src/api/serviceApi.ts
import axios from 'axios';
import { SERVICE_ENDPOINTS } from './urls';

export interface Service {
    service_id: number;
    service_name: string;
    description: string;
    daily_rate_lkr: number;
    advance_percentage: number;
    is_available: boolean;
}

export const fetchAvailableServices = async (): Promise<Service[]> => {
    try {
        const response = await axios.get(SERVICE_ENDPOINTS.GET_ALL);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to load services";
    }
};