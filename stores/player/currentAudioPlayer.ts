import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SongProps } from "@/interfaces/Song";
import ApiService from "./ApiServices";

const songs: SongProps[] = [
    {
        id: 1,
        name: "Welcome here",
        audio_link: "https://drive.google.com/uc?id=17ZlrPeRBZoPv0OFA8g0RvR__XIWVPW-4&export=download",
    },
];

export enum LikedStatus {
    Initial,
    success,
    error,
}
export enum CollectionsStatus {
    Initial,
    success,
    error,
}
export enum CreateCollectionStatus {
    waiting,
    done,
    Initial,
    error,
}
export interface IStateProps {
    songs: SongProps[];
    liked: number[];
    currentIndex: number;
    showBanner: boolean;
    isPlaying: boolean;
    activeSong: SongProps | null;
    songProgress: number;
    isShuffle: boolean;
    isRepeat: boolean;
    collections: [];
    createCollectionStatus: CreateCollectionStatus;
    isModelOpen: boolean;
    playingPlaylist: string;
    fetchlikedStatus: LikedStatus;
    collectionStatus: CollectionsStatus;
    passedDataToModel: object;
}

const initialState: IStateProps = {
    songs: songs,
    currentIndex: 0,
    isModelOpen: false,
    playingPlaylist: "",
    liked: [],
    collections: [],
    fetchlikedStatus: LikedStatus.Initial,
    createCollectionStatus: CreateCollectionStatus.Initial,

    collectionStatus: CollectionsStatus.Initial,
    passedDataToModel: {},
    isShuffle: false,
    isRepeat: false,
    showBanner: false,
    isPlaying: false,
    activeSong: songs[0],
    songProgress: 0,
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setActiveSong: (state, action) => {
            state.showBanner = true;
            state.songs = action.payload.songs;
            state.currentIndex = action.payload.index;
            state.activeSong = action.payload.songs[action.payload.index];
            if (action.payload.playlist) {
                state.playingPlaylist = action.payload.playlist;
            } else {
                state.playingPlaylist = "";
            }
        },

        nextSong: (state, action) => {
            state.currentIndex = action.payload;
            state.activeSong = state.songs[action.payload];
        },
        onShuffle: (state, action) => {
            state.isShuffle = action.payload;
        },
        onRepeat: (state, action) => {
            state.isRepeat = action.payload;
        },
        setSongProgress: (state, action) => {
            state.songProgress = action.payload;
        },

        playPause: (state, action) => {
            state.isPlaying = action.payload;
        },
        addLike: (state, action) => {
            let liked = [...state.liked, action.payload.song_id];
            state.liked = liked;
        },
        removeLike: (state, action) => {
            let liked = state.liked.filter(
                (value: number) => value != action.payload.song_id
            );
            state.liked = liked;
        },
        reorderQueue: (state, action) => {
            state.songs = action.payload;
        },
        addToQueue: (state, action) => {
            state.songs.splice(state.currentIndex + 1, 0, action.payload);
            state.songs = state.songs;
        },
        removeFromQueue: (state, action) => {
            if (action.payload > -1) {
                state.songs.splice(action.payload, 1);
            }
            state.songs = state.songs;
        },

        toggleModel: (state, action) => {
            state.isModelOpen = action.payload.data;
            state.passedDataToModel = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addSongToCollection.fulfilled, (state, action) => {
            const collection = state.collections.find(
                (e: any) => e.id == action.payload.collection_id
            );

            //@ts-ignore
            if (collection) collection.total_songs = collection.total_songs + 1;
            state.collections = state.collections;
        });
        builder.addCase(getLikedSongs.fulfilled, (state, action) => {
            state.fetchlikedStatus = LikedStatus.success;
            if (action.payload) {
                state.liked = action.payload.list.map((song: any) => song["id"])
            };
        });
        builder.addCase(getCollections.fulfilled, (state, action) => {
            state.collectionStatus = CollectionsStatus.success;
            if (action.payload) state.collections = action.payload.data;
        });
        builder.addCase(createNewCollection.pending, (state, action) => {
            state.createCollectionStatus = CreateCollectionStatus.waiting;
        });
        builder.addCase(createNewCollection.rejected, (state, action) => {
            state.createCollectionStatus = CreateCollectionStatus.error;
        });
        builder.addCase(renameCollection.fulfilled, (state, action) => {
            const collection = state.collections.find(
                (e: any) => e.id == action.payload!.collection_id
            );
            if (collection)
                // @ts-ignore
                collection.name = action.payload!.collection_name;

            state.collections = state.collections;
        });
        builder.addCase(deleteCollection.fulfilled, (state, action) => {
            const collections = state.collections.filter(
                (e: any) => e.id !== action.payload!.collection_id
            );
            //@ts-ignore
            state.collections = collections;
        });
        builder.addCase(createNewCollection.fulfilled, (state, action) => {
            let collections = state.collections;
            // @ts-ignore
            collections.push(action.payload.data[0]);

            const collection = collections.find(
                (e: any) => e.id == action.payload.data[0].id
            );

            //@ts-ignore
            if (collection) collection.total_songs = collection.total_songs + 1;
            state.collections = collections;
            state.createCollectionStatus = CreateCollectionStatus.done;
        });
        builder.addCase(getCollections.rejected, (state, action) => {
            state.collectionStatus = CollectionsStatus.error;
        });
        builder.addCase(getLikedSongs.rejected, (state, action) => {
            state.fetchlikedStatus = LikedStatus.error;
        });
    },
});

export const getLikedSongs = createAsyncThunk(
    "ApiServices/idsOflikedSongs",
    async (user: any, thunkAPI) => {
        try {
            return await ApiService.idsOflikedSongs(user);
        } catch (error) {
            console.log(error);
        }
    }
);
export const getCollections = createAsyncThunk(
    "ApiServices/getCollections",
    async (token: string, thunkAPI) => {
        try {
            return await ApiService.getCollections(token);
        } catch (error) {
            // console.log(error);
        }
    }
);
export const Like = createAsyncThunk(
    "ApiServices/addlike",
    async ({ user, song_id }: any, thunkAPI) => {
        try {
            return await ApiService.like({
                user,
                song_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);
export const unLike = createAsyncThunk(
    "ApiServices/removelike",
    async ({ user, song_id }: any, thunkAPI) => {
        try {
            return await ApiService.unLike({
                user,
                song_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);
export const addSongToCollection = createAsyncThunk(
    "ApiServices/addSongToCollection",
    async ({ collection_id, song_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.addSongToCollection(token, {
                collection_id,
                song_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);
export const removeSongFromCollection = createAsyncThunk(
    "ApiServices/removeSongFromCollection",
    async ({ collection_id, song_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.removeSongFromCollection(token, {
                collection_id,
                song_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);
export const createNewCollection = createAsyncThunk(
    "ApiServices/createNewCollection",
    async ({ name, song_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.createNewCollection(token, {
                name,
                song_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);
export const renameCollection = createAsyncThunk(
    "ApiServices/renameCollection",
    async ({ collection_id, collection_name, token }: any, thunkAPI) => {
        try {
            return await ApiService.renameCollection(token, {
                collection_id,
                collection_name,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);

export const deleteCollection = createAsyncThunk(
    "ApiServices/deleteCollection",
    async ({ collection_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.deleteCollection(token, {
                collection_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);

export const {
    setActiveSong,
    nextSong,
    playPause,
    onShuffle,
    addToQueue,
    onRepeat,
    setSongProgress,
    removeFromQueue,
    addLike,
    removeLike,
    toggleModel,
    reorderQueue,
} = playerSlice.actions;

export default playerSlice.reducer;
