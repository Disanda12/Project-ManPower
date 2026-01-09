import axios from 'axios';
import { USER_ENDPOINTS } from './urls';

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    user_type: string;
}

interface WorkerDetails extends User {
    service_id: number;
    service_name: string;
    experience_years: number;
    rating: number;
    total_jobs_completed: number;
    is_available: boolean;
    bio: string | null;
    profile_image: string | null;
    created_at: string;
}

interface CreateUserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    user_type: string;
    service_id?: string;
    experience_years?: string;
    bio?: string;
    profile_image?: string;
    is_available?: boolean;
}

// Create new user (admin only)
export const createUser = async (userData: CreateUserData): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(USER_ENDPOINTS.CREATE_USER, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to create user";
    }
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(USER_ENDPOINTS.GET_USERS, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch users";
    }
};

// Get all workers with profile details (admin only)
export const getAllWorkersDetails = async (): Promise<WorkerDetails[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(USER_ENDPOINTS.GET_WORKERS_DETAILS, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch workers";
    }
};

// Update user role (admin only)
export const updateUserRole = async (userId: string, userType: string): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(USER_ENDPOINTS.UPDATE_USER_ROLE(userId), { user_type: userType }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to update user role";
    }
};

// Delete user (admin only)
export const deleteUser = async (userId: string): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(USER_ENDPOINTS.DELETE_USER(userId), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to delete user";
    }
};