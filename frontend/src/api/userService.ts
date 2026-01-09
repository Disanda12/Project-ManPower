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