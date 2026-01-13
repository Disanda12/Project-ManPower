// src/api/userService.ts
import axios from 'axios';
import { USER_ENDPOINTS } from './urls'; // Ensure you add this to your urls.ts

export const updateProfile = async (userData: any) => {
    const formData = new FormData();
    formData.append('user_id', userData.user_id);
    formData.append('first_name', userData.first_name); // Separate
    formData.append('last_name', userData.last_name);   // Separate
    formData.append('phone', userData.phone);
    formData.append('address', userData.address);

    if (userData.imageFile) {
        formData.append('profile_image', userData.imageFile);
    }

    const response = await axios.post(USER_ENDPOINTS.UPDATE_PROFILE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Fetch User Profile
export const getUserProfile = async (userId: number) => {
    try {
        const response = await axios.get(USER_ENDPOINTS.GET_PROFILE(userId));
        return response.data; // Should return { success: true, data: { ... } }
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to fetch profile";
    }
};