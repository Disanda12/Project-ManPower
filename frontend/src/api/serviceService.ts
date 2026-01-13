import axios from 'axios';
import { BASE_URL } from './urls';

export interface Service {
    service_id: number;
    service_name: string;
    description?: string;
    daily_rate_lkr: number;
    advance_percentage: number;
    is_available: boolean;
    created_at?: string;
}

// Get all services
export const getAllServices = async (): Promise<Service[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/services`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch services';
    }
};

// Add new service (admin only)
export const addService = async (serviceData: {
    service_name: string;
    description?: string;
    daily_rate_lkr: number;
    advance_percentage?: number;
    is_available?: boolean;
}): Promise<{ message: string; service_id: number }> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${BASE_URL}/services`,
            serviceData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to add service';
    }
};

// Update service (admin only)
export const updateService = async (
    serviceId: number,
    serviceData: Partial<{
        service_name: string;
        description: string;
        daily_rate_lkr: number;
        advance_percentage: number;
        is_available: boolean;
    }>
): Promise<{ message: string }> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${BASE_URL}/services/${serviceId}`,
            serviceData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to update service';
    }
};

// Delete service (admin only)
export const deleteService = async (
    serviceId: number
): Promise<{ message: string }> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
            `${BASE_URL}/services/${serviceId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to delete service';
    }
};
