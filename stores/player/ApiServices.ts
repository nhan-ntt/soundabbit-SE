import API_URL from "@/config/apiUrl";
import axios from "axios";

const like = async ({ user, song_id }: any) => {
    await axios.post(
        `${API_URL}/users/${user.id}/favorite/songs/${song_id}`,
        {},
        {
            headers: {
                authorization: `Bearer ${user.token}`,
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
                authorization: `Bearer ${user.token}`,
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
                authorization: `Bearer ${user.token}`,
            },
        }
    );

    return response.data;
};

const getPlaylists = async (token: string) => {
    const response = await axios.get(`${API_URL}/playlists`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

const addSongToPlaylist = async ({
    token,
    playlist_id,
    song_id,
}: {
    token: string;
    playlist_id: string;
    song_id: string;
}) => {
    await axios.post(
        `${API_URL}/playlists/${playlist_id}/songs/${song_id}`,
        {},
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    );

    return playlist_id;
};

const removeSongFromPlaylist = async ({
    token,
    playlist_id,
    song_id,
}: {
    token: string;
    playlist_id: string;
    song_id: string;
}) => {
    const response = await axios.delete(
        `${API_URL}/playlists/${playlist_id}/songs/${song_id}`,
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

const createNewPlaylist = async ({
    token,
    name,
}: {
    token: string;
    name: string;
}) => {
    const response = await axios.post(
        `${API_URL}/playlists`,
        {
            name,
            is_public: false,
            image_link: null,
        },
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

const renamePlaylist = async ({
    token,
    id,
    name,
}: {
    token: string;
    id: string;
    name: string;
}) => {
    const response = await axios.put(
        `${API_URL}/playlists/${id}`,
        { id, name },
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

const deletePlaylist = async ({
    token,
    playlist_id,
}: {
    token: string;
    playlist_id: string;
}) => {
    const response = await axios.delete(`${API_URL}/playlists/${playlist_id}`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    return { ...response.data, playlist_id };
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
