import { SongProps } from "@/interfaces/Song";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import ApiService from "./ApiServices";

const songs: SongProps[] = [
    {
        id: 1,
        name: "Welcome here",
        audio_link:
            "https://drive.google.com/uc?id=17ZlrPeRBZoPv0OFA8g0RvR__XIWVPW-4&export=download",
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
    songs: SongProps[];
    liked: number[];
    currentIndex: number;
    showBanner: boolean;
    isPlaying: boolean;
    activeSong: SongProps | null;
    songProgress: number;
    isShuffle: boolean;
    isRepeat: boolean;
    playlists: [];
    createPlaylistStatus: CreatePlaylistStatus;
    isModelOpen: boolean;
    playingPlaylist: string;
    fetchlikedStatus: LikedStatus;
    playlistStatus: PlaylistsStatus;
    passedDataToModel: object;
}

const initialState: IStateProps = {
    songs: songs,
    currentIndex: 0,
    isModelOpen: false,
    playingPlaylist: "",
    liked: [],
    playlists: [],
    fetchlikedStatus: LikedStatus.Initial,
    createPlaylistStatus: CreatePlaylistStatus.Initial,

    playlistStatus: PlaylistsStatus.Initial,
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
        builder.addCase(addSongToPlaylist.fulfilled, (state, action) => {
            const playlist = state.playlists.find(
                (e: any) => e.id == action.payload.playlist_id
            );
            //@ts-ignore
            if (playlist) playlist.total_songs = playlist.total_songs + 1;
            state.playlists = state.playlists;
        });

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
                console.log("getPlaylsit");
                console.log(action.payload.list);
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
                (e: any) => e.id == action.payload!.playlist_id
            );
            if (playlist)
                // @ts-ignore
                playlist.name = action.payload!.playlist_name;

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
            // @ts-ignore
            playlists.push(action.payload.data[0]);

            const playlist = playlists.find(
                (e: any) => e.id == action.payload.data[0].id
            );

            //@ts-ignore
            if (playlist) playlist.total_songs = playlist.total_songs + 1;
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
    async (user: any, thunkAPI) => {
        try {
            return await ApiService.getPlaylists(user);
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
            return await ApiService.addSongToPlaylist(token, {
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
            return await ApiService.removeSongFromPlaylist(
                token,
                playlist_id,
                song_id
            );
        } catch (error) {
            // console.log(error);
        }
    }
);

export const createNewPlaylist = createAsyncThunk(
    "ApiServices/createNewPlaylist",
    async ({ name, song_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.createNewPlaylist(token, {
                name,
                song_id,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);

export const renamePlaylist = createAsyncThunk(
    "ApiServices/renamePlaylist",
    async ({ playlist_id, playlist_name, token }: any, thunkAPI) => {
        try {
            return await ApiService.renamePlaylist(token, {
                playlist_id,
                playlist_name,
            });
        } catch (error) {
            // console.log(error);
        }
    }
);

export const deletePlaylist = createAsyncThunk(
    "ApiServices/deletePlaylist",
    async ({ playlist_id, token }: any, thunkAPI) => {
        try {
            return await ApiService.deletePlaylist(token, playlist_id);
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
