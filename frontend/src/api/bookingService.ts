import axios from 'axios';
import { BOOKING_ENDPOINTS } from './urls';

export interface BookingPayload {
  customer_id: number;
  service_id: number;
  number_of_workers: number;
  work_description: string;
  start_date: string;
  end_date: string;
  total_amount_lkr: number;
  advance_amount_lkr: number;
}

export const createBooking = async (payload: BookingPayload) => {
  try {
    const response = await axios.post(BOOKING_ENDPOINTS.CREATE, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Booking submission failed";
  }
};

// src/api/bookingService.ts

export const getUserBookings = async (userId: number) => {
    try {
        const response = await axios.get(BOOKING_ENDPOINTS.GET_USER_BOOKINGS(userId));
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to load order history";
    }
};