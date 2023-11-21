import API_URL from "@/config/apiUrl";
import axios from "axios";

// Register user
const getRandomArtists = async () => {
    try {
        const response = await axios.all([
            axios.get(`${API_URL}/artists`),
            axios.get(`${API_URL}/songs`),
        ]);

        return {
            randomArtists: response[0].data.list.slice(0, 6),
            trendingArtists: response[0].data.list.slice(6, 16),
            topArtists: response[0].data.list.slice(16, 26),
            topHits: response[1].data.list.slice(0, 10),
            popular: response[1].data.list.slice(10, 20),
        };
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

const homePageApi = { getRandomArtists };

export default homePageApi;
