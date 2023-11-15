import axios from "axios";
import API_URL from "@/configs/apiUrl";

const like = async ({ user, song_id }: any) => {
    await axios.post(
        `/api/users/${user.id}/favorite/songs/${song_id}`,
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
        `/api/users/${user.id}/favorite/songs/${song_id}`,
        {
            headers: {
                authorization: "Bearer " + user.token,
            },
        }
    );
    return true;
};

const idsOflikedSongs = async (user: any) => {
    const response = await axios.get(`api/users/${user.id}/favorite/songs`, {
        headers: {
            authorization: "Bearer " + user.token,
        },
    });

    return response.data;
};

const getCollections = async (user: any) => {
    const response = await axios.get(`api/users/${user.id}/favorite/playlists`, {
        headers: {
            authorization: "Bearer " + user.token,
        },
    });
    return response.data;
};

const addSongToCollection = async (token: string, data: any) => {
    await axios.put(API_URL + "/collections/add/track", data, {
        headers: {
            authorization: "Bearer " + token,
        },
    });
    return data;
};

const removeSongFromCollection = async (token: string, data: any) => {
    const response = await axios.put(
        API_URL + "/collections/remove/track",
        data,
        {
            headers: {
                authorization: "Bearer " + token,
            },
        }
    );
    return response.data;
};

const createNewCollection = async (token: string, data: any) => {
    const response = await axios.post(API_URL + "/collections/new", data, {
        headers: {
            authorization: "Bearer " + token,
        },
    });
    return response.data;
};

const renameCollection = async (token: string, data: any) => {
    await axios.put(
        API_URL +
        "/collections/rename/" +
        data.collection_id +
        "?name=" +
        data.collection_name,
        {},
        {
            headers: {
                authorization: "Bearer " + token,
            },
        }
    );
    return data;
};

const deleteCollection = async (token: string, data: any) => {
    const response = await axios.delete(
        API_URL + "/collections/" + data.collection_id,
        {
            headers: {
                authorization: "Bearer " + token,
            },
        }
    );
    return data;
};

const ApiService = {
    like,
    unLike,
    createNewCollection,
    idsOflikedSongs,
    addSongToCollection,
    getCollections,
    deleteCollection,
    renameCollection,
    removeSongFromCollection,
};

export default ApiService;
