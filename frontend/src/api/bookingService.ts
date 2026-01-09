import axios from 'axios';
import { BASE_URL } from './urls';

interface BookingData {
    service_id: number;
    number_of_workers: number;
    work_description: string;
    start_date: string;
    end_date: string;
    total_amount_lkr: number;
    advance_amount_lkr: number;
    customer_id?: number; // Optional, used by admins to specify customer
}

interface Booking {
    booking_id: number;
    customer_id: number;
    service_id: number;
    service_name: string;
    number_of_workers: number;
    work_description: string;
    start_date: string;
    end_date: string;
    total_days: number;
    total_amount_lkr: number;
    advance_amount_lkr: number;
    remaining_amount_lkr: number;
    booking_status: string;
    payment_status: string;
    assigned_workers?: string;
    customer_first_name?: string;
    customer_last_name?: string;
    created_at: string;
    updated_at: string;
}

// Create a new booking
export const createBooking = async (bookingData: BookingData): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${BASE_URL}/bookings`, bookingData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to create booking";
    }
};

// Get customer's bookings
export const getCustomerBookings = async (): Promise<Booking[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch bookings";
    }
};

// Get all bookings (admin only)
export const getAllBookings = async (): Promise<Booking[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch bookings";
    }
};

// Assign workers to a booking (admin only)
export const assignWorkersToBooking = async (bookingId: number, workerIds: number[]): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${BASE_URL}/bookings/${bookingId}/assign-workers`, {
            workerIds
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to assign workers";
    }
};