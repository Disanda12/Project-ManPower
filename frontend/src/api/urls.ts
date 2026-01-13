// src/api/urls.ts
export const BASE_URL: string = "http://localhost:5000/api";

export const AUTH_ENDPOINTS = {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
} as const; 

export const FEEDBACK_ENDPOINTS = {
    SUBMIT: `${BASE_URL}/feedback/submit`,
    GET_BY_CUSTOMER: (id: number) => `${BASE_URL}/feedback/user/${id}`,
} as const;
export const SERVICE_ENDPOINTS = {
    GET_ALL: `${BASE_URL}/services/get-Services`,
    GET_BY_ID: (id: number) => `${BASE_URL}/services/${id}`,
} as const;

export const BOOKING_ENDPOINTS = {
    CREATE: `${BASE_URL}/bookings/create`,
    GET_USER_BOOKINGS: (userId: number) => `${BASE_URL}/bookings/user/${userId}`,
} as const;

export const USER_ENDPOINTS = {
    UPDATE_PROFILE: `${BASE_URL}/profile/update`,
    GET_PROFILE: (userId: number) => `${BASE_URL}/profile/${userId}`,
};
export const USER_ENDPOINTS = {
    GET_USERS: `${BASE_URL}/users`,
    GET_WORKERS_DETAILS: `${BASE_URL}/users/workers`,
    CREATE_USER: `${BASE_URL}/users`,
    UPDATE_USER: (id: string) => `${BASE_URL}/users/${id}`,
    UPDATE_USER_ROLE: (id: string) => `${BASE_URL}/users/${id}/role`,
    DELETE_USER: (id: string) => `${BASE_URL}/users/${id}`,
} as const;
