import { API } from "@/config/api";
import { Song } from "@/interfaces/song";
import axios from "axios";

const getHomePageData = async () => {
    try {
        const respone = await axios.all([
            axios.get(API.artists),
            axios.get(API.songs),
        ]);

        const artists = respone[0].data.list
        const songs = respone[1].data.list.sort((songA: Song, songB: Song) => songB.streams - songA.streams)
        console.log({songs})

        return {
            randomArtists: artists.slice(0, 6),
            trendingArtists: artists.slice(6, 16),
            topArtists: songs.slice(16, 26),
            topHits: songs.slice(0, 10),
            popular: songs.slice(10, 24),
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

export default { getHomePageData }
