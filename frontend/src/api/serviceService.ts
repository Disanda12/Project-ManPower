import axios from 'axios';
import { BASE_URL } from './urls';

interface Service {
    service_id: number;
    service_name: string;
    description?: string;
    base_price?: number;
    created_at?: string;
}

// Get all services
export const getAllServices = async (): Promise<Service[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/services`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch services";
    }
};