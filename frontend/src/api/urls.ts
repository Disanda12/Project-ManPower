// src/api/urls.ts
const BASE_URL: string = "http://localhost:5000/api";

export const AUTH_ENDPOINTS = {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
} as const; 

export const USER_ENDPOINTS = {
    GET_USERS: `${BASE_URL}/users`,
    UPDATE_USER_ROLE: (id: string) => `${BASE_URL}/users/${id}/role`,
    DELETE_USER: (id: string) => `${BASE_URL}/users/${id}`,
} as const;
