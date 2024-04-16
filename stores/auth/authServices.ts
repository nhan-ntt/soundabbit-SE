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


const authService = {
    register,
};

export default authService;
