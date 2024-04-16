import { User } from "@/interfaces/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    CookieValueTypes,
    getCookie,
    setCookie,
} from "cookies-next";
import authService from "./authServices";

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
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                setCookie("user", JSON.stringify(state.user), {
                    maxAge: 60 * 60 * 24 * 30,
                });
            }
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

export const { updateUser } = authSlice.actions;
export default authSlice.reducer;
