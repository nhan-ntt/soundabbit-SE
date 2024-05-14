import { API } from "@/config/api";
import axios from "axios";

// Register user
const getGenres = async () => {
    try {
        const response = await axios.get(API.genres);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw {
                status: error.request.status,
                success: error.response.data.success,
                message: error.response.data.message,
            };
        } else {
            throw error;
        }
    }
};

export default { getGenres };
