import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth/authSlice";
import genresSlice from "./genres/genresSlice";
import homePageSlice from "./homePage/homePageSlice";
import audioPlayer from "./player/currentAudioPlayer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const reducer = combineReducers({
    auth: authSlice,
    player: audioPlayer,
    homePage: homePageSlice,
    genres: genresSlice,
});

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
