import React, { useEffect, useState } from "react";
import AppLayout from "@/layouts/appLayout";
import { useSelector } from "react-redux";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import {
    PlaylistsStatus,
    getPlaylists,
} from "@/stores/player/currentAudioPlayer";
import { useDispatch } from "react-redux";

function Library() {
    const { playlists, playlistStatus } = useSelector(
        (state: any) => state.player
    );

    const { user } = useSelector((state: any) => state.auth);

    const dispatch = useDispatch<any>();

    useEffect(() => {
        if (playlistStatus != PlaylistsStatus.success) {
            dispatch(getPlaylists(user.token));
        }
    }, []);

    return (
        <AppLayout>
            <div className="w-full min-h-[1000px] px-6 pt-5 mobile:px-4 ">
                <h1 className="text-[70px] text-white mb-5 px-2 mobile:px-0 mobile:text-[40px]">
                    Library
                </h1>
                <div
                    className="grid grid-rows-1 grid-cols-5 gap-4
         laptop:grid-cols-4 mini-laptop:grid-cols-3 laptop:gap-3 
         tablet:grid-cols-3
         
          mobile:grid-cols-2 mobile:gap-4"
                >
                    <Link href="/playlist/liked">
                        <div
                            className="flex flex-col p-3.5cursor-pointer p-3.5 bg-gradient-to-t from-[#2c2a2a4a] to-[#2c2a2ac7] hover:bg-[#4340409d]
           tablet:hover:bg-transparent mobile:hover:bg-transparent 
           rounded h-full mini-laptop:p-3 tablet:p-0 tablet:from-transparent tablet:to-transparent
           mobile:from-transparent mobile:to-transparent mobile:p-0 mobile:mr-0
           "
                        >
                            <div
                                className="cursor-pointer  rounded-lg hover:from-[#bdb6d3] hover:to-[#4C17F3]
            bg-gradient-to-tl to-[#4C17F3] from-[#a79ccc]
             flex justify-center items-center w-full h-full 
             tablet:w-full mobile:w-full min-h-[180px]"
                            >
                                <i className="icon-heart text-[70px] mobile:text-[70px] laptop:text-[100px]"></i>
                            </div>
                            <div className="py-3">
                                <p className="">Liked Songs</p>
                            </div>
                        </div>
                    </Link>
                    {playlists &&
                        playlists.map((playlist: any) => {
                            return (
                                <Link
                                    key={playlist.id}
                                    href={`/playlist/${playlist.id}`}
                                >
                                    <div
                                        className="cursor-pointer p-3.5 bg-gradient-to-t from-[#2c2a2a4a] to-[#2c2a2ac7] hover:bg-[#4340409d]
           tablet:hover:bg-transparent mobile:hover:bg-transparent 
           rounded h-full mini-laptop:p-3 tablet:p-0 tablet:from-transparent tablet:to-transparent
           mobile:from-transparent mobile:to-transparent mobile:p-0 mobile:mr-0
           "
                                    >
                                        <div
                                            style={{
                                                backgroundColor: playlist.color,
                                            }}
                                            className="p-0 m-0 rounded"
                                        >
                                            <Image
                                                src={playlist.image_link}
                                                width="300"
                                                height="300"
                                                alt="playlist cover image"
                                            />
                                        </div>

                                        <div className="py-3">
                                            <p className="">{playlist.name}</p>
                                            <p className="text-gray-300 text-sm mt-1"></p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
                <div className="pb-32"></div>
            </div>
        </AppLayout>
    );
}

export default Library;
