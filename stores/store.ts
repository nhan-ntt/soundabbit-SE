import { configureStore } from "@reduxjs/toolkit";
import audioPlayer from "./player/currentAudioPlayer";
import homePageSlice from "./homePage/homePageSlice";
import genresSlice from "./genres/genresSlice";

const store = configureStore({
    reducer: {
        player: audioPlayer,
        homePage: homePageSlice,
        genres: genresSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
