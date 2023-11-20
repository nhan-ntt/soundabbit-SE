import React from "react";
import Head from "next/head";
import { useLogin } from "../hooks/useLogin";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar";

function AppLayout({ children }: any) {
    useLogin();

    return (
        <div>
            <Head>
                <title>Rhyme</title>
            </Head>

            <div className="text-white bg-[#121212]">
                <div className="flex flex-row h-screen w-screen max-w-full">
                    <Sidebar />
                    <div className="h-screen scroll overflow-y-scroll">
                        <div
                            className=" bg-gradient-to-t from-[#121212]
                 via-[#121212f0] to-[#12121298] w-full transition-colors"
                        >
                            <Navbar />
                            <div
                                className="w-[calc(100vw_-_14rem)] 
                 mini-laptop:w-[calc(100vw_-_55px)] tablet:w-screen mobile:w-screen"
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppLayout;
