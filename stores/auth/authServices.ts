import axios from "axios";

import { setCookie } from "cookies-next";
import API_URL from "@/config/apiUrl";

// Register user
const register = async (userData: any) => {
    try {
        return await axios.post(`${API_URL}/auth/register`, {
            ...userData,
            image_link: null,
        });
    } catch (error: any) {
        if (error.response) {
            throw {
                status: error.request.status,
                success: error.response.data.success,
                message: error.response.data.message,
            };
        }

        throw error;
    }
};

const login = async (userData: any) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);

        if (response.data) {
            setCookie("user", JSON.stringify(response.data), {
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw {
                status: error.request.status,
                success: error.response.data.success,
                message: error.response.data.message,
            };
        }

        throw error;
    }
};

const authService = {
    register,
    login,
};

export default authService;
