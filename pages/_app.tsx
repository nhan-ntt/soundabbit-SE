import "@/styles/globals.css";
import type { AppProps } from "next/app";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import { ToastContainer } from "react-toastify";
import AudioHandler from "@/components/AudioHandler";
import MobileMenu from "@/components/MobileMenu";
import { usePathname } from "next/navigation";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Provider from "./providers";
import PlayingModal from "@/components/Playing";

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

export default function App({ Component, pageProps }: AppProps) {
    const pathname = usePathname();
    const isKeyboardOpen = useDetectKeyboardOpen();

    return (
        <Provider>
            <Head>
                <link
                    rel="preload"
                    href="/rhyme-icons.ttf"
                    as="font"
                    crossOrigin=""
                    type="font/ttf"
                />
            </Head>

            {![
                "/login",
                "/register",
                "/_error",
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
        </Provider>
    );
}
