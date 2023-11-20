import { PlaylistProps } from "@/interfaces/playlist";
import { SongProps } from "@/interfaces/Song";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import ApiService from "./ApiServices";

const songs: SongProps[] = [
    {
        id: 1,
        name: "Rhyme",
        audio_link:
            "https://drive.google.com/uc?id=17ZlrPeRBZoPv0OFA8g0RvR__XIWVPW-4&export=download",
        streams: 0,
    },
];

export enum LikedStatus {
    Initial,
    success,
    error,
}
export enum PlaylistsStatus {
    Initial,
    success,
    error,
}
export enum CreatePlaylistStatus {
    waiting,
    done,
    Initial,
    error,
}
export interface IStateProps {
    queue: SongProps[];
    liked: number[];
    currentIndex: number;
    showBanner: boolean;
    isPlaying: boolean;
    activeSong: SongProps | null;
    volume: number;
    duration: number;
    currentTime: number;
    songProgress: number;
    isShuffle: boolean;
    isRepeat: boolean;
    playlists: PlaylistProps[];
    createPlaylistStatus: CreatePlaylistStatus;
    isModalOpen: boolean;
    playingPlaylist: string;
    fetchlikedStatus: LikedStatus;
    playlistStatus: PlaylistsStatus;
    passedDataToModal: object;
}

const initialState: IStateProps = {
    queue: songs,
    currentIndex: 0,
    isModalOpen: false,
    volume: 1,
    duration: 0,
    currentTime: 0,
    playingPlaylist: "",
    liked: [],
    playlists: [],
    fetchlikedStatus: LikedStatus.Initial,
    createPlaylistStatus: CreatePlaylistStatus.Initial,

    playlistStatus: PlaylistsStatus.Initial,
    passedDataToModal: {},
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
            state.queue = action.payload.songs;
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
            state.activeSong = state.queue[action.payload];
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
            state.queue = action.payload;
        },
        addToQueue: (state, action) => {
            state.queue.splice(state.currentIndex + 1, 0, action.payload);
            state.queue = state.queue;
        },
        removeFromQueue: (state, action) => {
            if (action.payload > -1) {
                state.queue.splice(action.payload, 1);
            }
            state.queue = state.queue;
        },
        toggleModal: (state, action) => {
            state.isModalOpen = action.payload.data;
            state.passedDataToModal = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        setDuration: (state, action) => {
            state.duration = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addSongToPlaylist.fulfilled, (state, action) => { });

        builder.addCase(getLikedSongs.fulfilled, (state, action) => {
            state.fetchlikedStatus = LikedStatus.success;
            if (action.payload) {
                state.liked = action.payload.list.map(
                    (song: any) => song["id"]
                );
            }
        });

        builder.addCase(getPlaylists.fulfilled, (state, action) => {
            state.playlistStatus = PlaylistsStatus.success;
            if (action.payload) {
                state.playlists = action.payload.list;
            }
        });

        builder.addCase(createNewPlaylist.pending, (state, action) => {
            state.createPlaylistStatus = CreatePlaylistStatus.waiting;
        });

        builder.addCase(createNewPlaylist.rejected, (state, action) => {
            state.createPlaylistStatus = CreatePlaylistStatus.error;
        });

        builder.addCase(renamePlaylist.fulfilled, (state, action) => {
            const playlist = state.playlists.find(
                (e: any) => e.id == action.payload.id
            );
            if (playlist)
                // @ts-ignore
                playlist.name = action.payload.name;

            state.playlists = state.playlists;
        });

        builder.addCase(deletePlaylist.fulfilled, (state, action) => {
            const playlists = state.playlists.filter(
                (playlist: any) => playlist.id !== action.payload!.playlist_id
            );
            //@ts-ignore
            state.playlists = playlists;
        });

        builder.addCase(createNewPlaylist.fulfilled, (state, action) => {
            let playlists = state.playlists;
            playlists.push(action.payload);
            state.playlists = playlists;

            state.createPlaylistStatus = CreatePlaylistStatus.done;
        });

        builder.addCase(getPlaylists.rejected, (state, action) => {
            state.playlistStatus = PlaylistsStatus.error;
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

export const getPlaylists = createAsyncThunk(
    "ApiServices/getPlaylists",
    async (token:string,  thunkAPI) => {
        try {
            return await ApiService.getPlaylists(token);
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

export const addSongToPlaylist = createAsyncThunk(
    "ApiServices/addSongToPlaylist",
    async ({ playlist_id, song_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.addSongToPlaylist({
                token,
                playlist_id,
                song_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);

export const removeSongFromPlaylist = createAsyncThunk(
    "ApiServices/removeSongFromPlaylist",
    async ({ playlist_id, song_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.removeSongFromPlaylist({
                token,
                playlist_id,
                song_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);

export const createNewPlaylist = createAsyncThunk(
    "ApiServices/createNewPlaylist",
    async ({ name, token }: any, thunkAPI) => {
        try {
            return await ApiService.createNewPlaylist({ token, name });
        } catch (error) {
            // console.log(error);
        }
    }
);

export const renamePlaylist = createAsyncThunk(
    "ApiServices/renamePlaylist",
    async ({ id, name, token }: any, thunkAPI) => {
        try {
            return await ApiService.renamePlaylist({ token, id, name });
        } catch (error) {
            // console.log(error);
        }
    }
);

export const deletePlaylist = createAsyncThunk(
    "ApiServices/deletePlaylist",
    async ({ playlist_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.deletePlaylist({ token, playlist_id });
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
    setVolume,
    setDuration,
    setCurrentTime,
    onRepeat,
    setSongProgress,
    removeFromQueue,
    addLike,
    removeLike,
    toggleModal,
    reorderQueue,
} = playerSlice.actions;

export default playerSlice.reducer;
