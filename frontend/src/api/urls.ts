// src/api/urls.ts
const BASE_URL: string = "http://localhost:5000/api";

export const AUTH_ENDPOINTS = {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
} as const; 

