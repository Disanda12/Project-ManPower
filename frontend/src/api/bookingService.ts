import axios from 'axios';
import { BASE_URL } from './urls';

/* ===================== TYPES ===================== */

export interface BookingPayload {
    service_id: number;
    number_of_workers: number;
    work_description: string;
    start_date: string;
    end_date: string;
    total_amount_lkr: number;
    advance_amount_lkr: number;
}

export interface Booking {
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

/* ===================== API CALLS ===================== */

// Create booking (customer)
export const createBooking = async (
    bookingData: BookingPayload
): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${BASE_URL}/bookings`,
            bookingData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Booking submission failed';
    }
};

// Get logged-in customer's bookings
export const getCustomerBookings = async (): Promise<Booking[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${BASE_URL}/bookings/my-bookings`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to load order history';
    }
};

// Get all bookings (admin)
export const getAllBookings = async (): Promise<Booking[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/bookings`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch bookings';
    }
};

// Assign workers (admin)
export const assignWorkersToBooking = async (
    bookingId: number,
    workerIds: number[]
): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${BASE_URL}/bookings/${bookingId}/assign-workers`,
            { workerIds },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to assign workers';
    }
};

// Update booking status (admin)
export const updateBookingStatus = async (
    bookingId: number,
    status: string
): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${BASE_URL}/bookings/${bookingId}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to update booking status';
    }
};
