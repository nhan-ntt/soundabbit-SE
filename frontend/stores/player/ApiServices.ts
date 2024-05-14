import { API } from "@/config/api";
import axios from "axios";

const like = async ({ user, song_id }: any) => {
    await axios.post(
        API.favoriteSong({ userID: user.id, songID: song_id }),
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
        API.favoriteSong({ userID: user.id, songID: song_id }),
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
        API.favoriteSongs({ userID: user.id }),
        {
            headers: {
                authorization: `Bearer ${user.token}`,
            },
        }
    );

    return response.data;
};

const getPlaylists = async (token: string) => {
    const response = await axios.get(API.playlists, {
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
        API.playlistSong({ playlistID: playlist_id, songID: song_id }),
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
        API.playlistSong({ playlistID: playlist_id, songID: song_id }),
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
        API.playlists,
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

const updatePlaylist = async ({
    token,
    id,
    update,
}: {
    token: string;
    id: string;
    update: any;
}) => {
    const response = await axios.put(
        API.playlist({ playlistID: id }),
        update,
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
    const response = await axios.delete(API.playlist({ playlistID: playlist_id }), {
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
    updatePlaylist,
};

export default ApiService;
