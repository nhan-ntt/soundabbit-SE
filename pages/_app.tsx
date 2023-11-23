import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store, persistor } from "@/stores/store";
import PagesProgressBar from "nextjs-progressbar";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import AudioHandler from "@/components/AudioHandler";
import MobileMenu from "@/components/MobileMenu";
import { PersistGate } from "redux-persist/integration/react";
import { usePathname, useRouter } from "next/navigation";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `% s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isKeyboardOpen = useDetectKeyboardOpen();

    return (
        <Provider store={store}>
            <NextUIProvider navigate={router.push}>
                <PersistGate loading={null} persistor={persistor}>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                        <Head>
                            <link
                                rel="preload"
                                href="/rhyme-icons.ttf"
                                as="font"
                                crossOrigin=""
                                type="font/ttf"
                            />
                        </Head>

                        <PagesProgressBar
                            color="#2bb540"
                            height={3}
                            options={{ showSpinner: false }}
                        />

                        {![
                            "/login",
                            "/register",
                            "/_error",
                            "/playing",
                            "/",
                        ].includes(pathname) && (
                            <>
                                <MobileMenu isHidden={isKeyboardOpen} />
                                <AudioPlayer isHidden={isKeyboardOpen} />
                            </>
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

                        <AudioHandler />
                    </ThemeProvider>
                </PersistGate>
            </NextUIProvider>
        </Provider>
    );
}

export default App;
