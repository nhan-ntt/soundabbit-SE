import { combineReducers, configureStore } from "@reduxjs/toolkit";

import genresSlice from "./genres/genresSlice";
import homePageSlice from "./homePage/homePageSlice";
import audioPlayer from "./player/currentAudioPlayer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { RESET_STATE } from "./action";

const appReducer = combineReducers({
    player: audioPlayer,
    homePage: homePageSlice,
    genres: genresSlice,
});

const rootReducer = (state: any, action: any) => {
    if (action.type === RESET_STATE) {
        storage.removeItem("persist:root");
        return appReducer(undefined, action);
    }

    return appReducer(state, action);
};

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
