import { AxiosError } from "./../../node_modules/axios/index.d";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authServices";
import { CookieValueTypes, deleteCookie, getCookie } from "cookies-next";
import { User } from "@/interfaces/user";

export enum AuthStatus {
    Loading,
    Error,
    Success,
    Initial,
}

export interface StateProps {
    user: User | null;
    status: AuthStatus;
    message: string | unknown;
}

const user: CookieValueTypes = getCookie("user");

// initalize state
const initalState: StateProps = {
    user: user ? JSON.parse(user!.toString()) : null,
    status: AuthStatus.Initial,
    message: "",
};

// authslice
const authSlice = createSlice({
    name: "auth",
    initialState: initalState,
    reducers: {
        reset: (state) => {
            deleteCookie("user");
            state.status = AuthStatus.Initial;
            state.user = null;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder.addCase(register.pending, (state, action) => {
            state.status = AuthStatus.Loading;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.status = AuthStatus.Initial;
            state.message = "";
        });
        builder.addCase(register.rejected, (state, action) => {
            state.status = AuthStatus.Error;
            state.message = action.payload;
        });
        builder.addCase(login.pending, (state, action) => {
            state.status = AuthStatus.Loading;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.status = AuthStatus.Success;
            state.user = action.payload;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.status = AuthStatus.Error;
            state.message = action.payload;
        });
    },
});

export const register = createAsyncThunk(
    "auth/register",
    async (user: any, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (error: any) {
            if (error.message) {
                const message: string = error.message;
                return thunkAPI.rejectWithValue(message);
            } else {
                return thunkAPI.rejectWithValue("Something went wrong");
            }
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (user: any, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch (error: any) {
            // console.log(error);
            if (error.status) {
                const message: string = error.message;
                return thunkAPI.rejectWithValue(message);
            } else {
                return thunkAPI.rejectWithValue("Something went wrong");
            }
        }
    }
);

export const { reset } = authSlice.actions;
export default authSlice.reducer;
