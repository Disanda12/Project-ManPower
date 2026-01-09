import axios from 'axios';
import { AUTH_ENDPOINTS } from './urls';
interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    password?: string;
    user_type?: string;
}

//sign Up 
export const registerUser = async (userData: UserData): Promise<any> => {
    try {
        const finalData = { 
            ...userData, 
            user_type: userData.user_type || 'customer' 
        };
        console.log("user Data", userData)
        const response = await axios.post(AUTH_ENDPOINTS.SIGNUP, finalData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Registration failed";
    }
};

//Login 
export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {
    try {
        const response = await axios.post(AUTH_ENDPOINTS.LOGIN, credentials);
        
        // If login is successful, we store the token in localStorage 
        // so the user stays logged in even if they refresh the page.
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('userName', response.data.name);
        }
        
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Invalid email or password";
    }
};