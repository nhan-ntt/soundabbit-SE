import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useSelector } from "react-redux";
import store from "../stores/store";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";
import SidebarItem from "../components/sidebarItem";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import AudioHandler from "@/components/AudioHandler";

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isKeyboardOpen = useDetectKeyboardOpen();

    return (
        <Provider store={store}>
            <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="dark">
                    <Head>
                        <link
                            rel="preload"
                            href="/rhyme-icons.ttf"
                            as="font"
                            crossOrigin=""
                            type="font/ttf"
                        />
                        <link
                            rel="preload"
                            href="/ProximaNova/Proxima Nova Reg.otf"
                            as="font"
                            crossOrigin=""
                            type="font/otf"
                        />
                        <link
                            rel="preload"
                            href="/ProximaNova/Proxima Nova Bold.otf"
                            as="font"
                            crossOrigin=""
                            type="font/otf"
                        />
                    </Head>
                    <NextNProgress
                        color="#2bb540"
                        stopDelayMs={10}
                        height={3}
                        options={{ showSpinner: false }}
                    />

                    {router.pathname !== "/login" &&
                        router.pathname !== "/register" &&
                        router.pathname !== "/_error" &&
                        router.pathname !== "/playing" &&
                        router.pathname !== "/" && (
                            <div
                                className={`bg-[#121212] hidden mobile:block tablet:block 
      fixed bottom-0 left-0 right-0 w-full pt-2 pb-1 z-20 ${isKeyboardOpen ? "invisible" : "visible"
                                    }`}
                            >
                                <div className="flex flex-row justify-center ">
                                    <SidebarItem name="home" label="Home" />
                                    <SidebarItem name="search" label="Search" />
                                    <SidebarItem
                                        name="library"
                                        label="Library"
                                    />
                                </div>
                            </div>
                        )}

                    <Component {...pageProps} />
                    <ToastContainer
                        position="top-center"
                        autoClose={1000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                    <AddToPlaylistModal />
                    <div>
                        {router.pathname !== "/login" &&
                            router.pathname !== "/register" &&
                            router.pathname !== "/_error" &&
                            router.pathname !== "/playing" &&
                            router.pathname !== "/" ? (
                            <AudioPlayer
                                className={
                                    isKeyboardOpen ? "invisible" : "visible"
                                }
                            />
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <AudioHandler />
                </NextThemesProvider>
            </NextUIProvider>
        </Provider>
    );
}

export default MyApp;
