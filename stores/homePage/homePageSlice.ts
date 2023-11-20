import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import homePageApi from "./homePageApi";
import { Artists } from "@/interfaces/artist";
import { SongProps } from "@/interfaces/Song";

export enum RequestStatus {
    Loading,
    Error,
    Success,
    Initial,
}
export interface HomePageState {
    recentUsers: Artists[];
    trendingArtists: Artists[];
    topHits: SongProps[];
    popularHits: SongProps[];
    status: RequestStatus;
}
const initialState: HomePageState = {
    recentUsers: [],
    topHits: [],
    trendingArtists: [],
    popularHits: [],
    status: RequestStatus.Initial,
};
const homePageSlice = createSlice({
    name: "homePage",
    initialState: initialState,
    reducers: {
        reset: () => { },
    },
    extraReducers: (builder) => {
        builder.addCase(getRecentUsers.pending, (state, action) => {
            state.status = RequestStatus.Loading;
        });
        builder.addCase(getRecentUsers.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.recentUsers = action.payload.randomArtists;
            state.topHits = action.payload.topHits;
            state.popularHits = action.payload.popular;
            state.trendingArtists = action.payload.trendingArtists;
        });
        builder.addCase(getRecentUsers.rejected, (state, action) => {
            state.status = RequestStatus.Error;
        });
    },
});

export const getRecentUsers = createAsyncThunk("homePage/random", async () => {
    return await homePageApi.getRandomArtists();
});

export const { reset } = homePageSlice.actions;
export default homePageSlice.reducer;
