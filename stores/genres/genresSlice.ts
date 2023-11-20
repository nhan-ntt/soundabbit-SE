import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import genresApi from "./genresApi";
import { GenreProp } from "@/interfaces/genres";

export enum RequestStatus {
    Loading,
    Error,
    Success,
    Initial,
}

export interface GenresState {
    status: RequestStatus;
    genres: GenreProp[]
}

const initialState: GenresState = {
    status: RequestStatus.Initial,
    genres: [],
};

const genresSlice = createSlice({
    name: "genres",
    initialState: initialState,
    reducers: {
        reset: () => { },
    },
    extraReducers: (builder) => {
        builder.addCase(getGenres.pending, (state, action) => {
            state.status = RequestStatus.Loading;
        });
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.genres = action.payload.list;
        });
        builder.addCase(getGenres.rejected, (state, action) => {
            state.status = RequestStatus.Error;
        });
    },
});

export const getGenres = createAsyncThunk("genres", async () => {
    return await genresApi.getGenres();
});

export const { reset } = genresSlice.actions;
export default genresSlice.reducer;
