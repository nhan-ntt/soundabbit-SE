import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import homePageApi from "./homePageApi";
import { Artist } from "@/interfaces/artist";
import { Song } from "@/interfaces/song";

export enum RequestStatus {
    Loading,
    Error,
    Success,
    Initial,
}
export interface HomePageState {
    recentUsers: Artist[];
    trendingArtists: Artist[];
    topHits: Song[];
    popularHits: Song[];
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
        builder.addCase(getData.pending, (state, action) => {
            state.status = RequestStatus.Loading;
        });
        builder.addCase(getData.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.recentUsers = action.payload.randomArtists;
            state.topHits = action.payload.topHits;
            state.popularHits = action.payload.popular;
            state.trendingArtists = action.payload.trendingArtists;
        });
        builder.addCase(getData.rejected, (state, action) => {
            state.status = RequestStatus.Error;
        });
    },
});

export const getData = createAsyncThunk("homePage/getData", async () => {
    return await homePageApi.getHomePageData();
});

export const { reset } = homePageSlice.actions;
export default homePageSlice.reducer;
