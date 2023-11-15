import API_URL from "@/configs/apiUrl";
import axios from "axios";

const like = async ({ user, song_id }: any) => {
    await axios.post(
        `${API_URL}/users/${user.id}/favorite/songs/${song_id}`,
        {},
        {
            headers: {
                authorization: "Bearer " + user.token,
            },
        }
    );

    return true;
};

const unLike = async ({ user, song_id }: any) => {
    await axios.delete(
        `${API_URL}/users/${user.id}/favorite/songs/${song_id}`,
        {
            headers: {
                authorization: "Bearer " + user.token,
            },
        }
    );

    return true;
};

const idsOflikedSongs = async (user: any) => {
    const response = await axios.get(
        `${API_URL}/users/${user.id}/favorite/songs`,
        {
            headers: {
                authorization: "Bearer " + user.token,
            },
        }
    );

    return response.data;
};

const getPlaylists = async (user: any) => {
    const response = await axios.get(`${API_URL}/playlists`, {
        headers: {
            authorization: "Bearer " + user.token,
        },
    });
    return response.data;
};

const addSongToPlaylist = async (
    token: string,
    playlist_id: string,
    song_id: string,
    data: any
) => {
    await axios.put(
        `${API_URL}/playlists/${playlist_id}/songs/${song_id}`,
        data,
        {
            headers: {
                authorization: "Bearer " + token,
            },
        }
    );

    return data;
};

const removeSongFromPlaylist = async (
    token: string,
    playlist_id: string,
    song_id: string
) => {
    const response = await axios.delete(
        `${API_URL}/playlists/${playlist_id}/songs/${song_id}`,
        {
            headers: {
                authorization: "Bearer " + token,
            },
        }
    );
    return response.data;
};

const createNewPlaylist = async (token: string, data: any) => {
    const response = await axios.post(`${API_URL}/playlists`, data, {
        headers: {
            authorization: "Bearer " + token,
        },
    });

    return response.data;
};

const renamePlaylist = async (token: string, data: any) => {
    await axios.put(`${API_URL}/playlists`, data, {
        headers: {
            authorization: "Bearer " + token,
        },
    });

    return data;
};

const deletePlaylist = async (token: string, playlist_id: string) => {
    await axios.delete(`${API_URL}/playlists/${playlist_id}`, {
        headers: {
            authorization: "Bearer " + token,
        },
    });
    return { playlist_id };
};

const ApiService = {
    like,
    unLike,
    createNewPlaylist,
    idsOflikedSongs,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getPlaylists,
    deletePlaylist,
    renamePlaylist,
};

export default ApiService;
