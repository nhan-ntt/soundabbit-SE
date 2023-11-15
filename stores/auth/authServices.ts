import axios from "axios";

import { setCookie } from "cookies-next";
import API_URL from "@/configs/apiUrl";

// Register user
const register = async (userData: any) => {
    try {
        return await axios.post(`${API_URL}/auth/register`, userData);
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

        const user = {
            id: response.data.id,
            token: response.data.token,
        };

        if (response.data) {
            setCookie("user", JSON.stringify(user), {
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return user;
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
