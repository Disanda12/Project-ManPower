// src/api/feedbackService.ts
import axios from 'axios';
import { FEEDBACK_ENDPOINTS } from './urls';

export interface FeedbackData {
    booking_id: number;
    customer_id: number;
    rating: number;
    comment: string;
    
}
export interface ApprovedFeedback {
    feedback_id: number;
    customer_name: string;
    profile_picture: string;
    rating: number;
    comment: string;
}
export const submitFeedback = async (data: FeedbackData): Promise<any> => {
    try {
        // Send as a simple JSON object instead of FormData
        const response = await axios.post(FEEDBACK_ENDPOINTS.SUBMIT, {
            booking_id: data.booking_id,
            customer_id: data.customer_id,
            rating: data.rating,
            comment: data.comment
        });
        
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to submit feedback";
    }
};

export const getTopApprovedFeedbacks = async (): Promise<ApprovedFeedback[]> => {
    try {
        const response = await axios.get(FEEDBACK_ENDPOINTS.GET_TOP_APPROVED);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to load feedbacks";
    }
}