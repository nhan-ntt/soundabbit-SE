import React, { useEffect } from "react";
import AppLayout from "@/layouts/appLayout";
import { useSelector } from "react-redux";
import {
    PlaylistsStatus,
    getPlaylists,
} from "@/stores/player/currentAudioPlayer";
import { useDispatch } from "react-redux";
import PlaylistCard from "@/components/PlaylistCard";
import { NextPage } from "next";
import { Playlist } from "@/interfaces/playlist";
import { ContentLoading } from "@/components/ContentLoading";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Library: NextPage = () => {
    const { playlists, playlistStatus } = useSelector(
        (state: any) => state.player
    );

    const { data: session, status } = useSession();
    const router = useRouter();

    const dispatch = useDispatch<any>();

    useEffect(() => {
        if (status == "authenticated" && playlistStatus != PlaylistsStatus.success) {
            dispatch(getPlaylists(session.user.token || " "));
        }
    }, []);

    if (playlistStatus != PlaylistsStatus.success) {
        return (
            <AppLayout>
                <ContentLoading />
            </AppLayout>
        );
    }

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
                    <Card
                        isPressable
                        onPress={() => router.push(`/playlist/liked`)}
                    >
                        <CardBody>
                            <div
                                className="cursor-pointer  rounded-lg hover:from-[#bdb6d3] hover:to-[#4C17F3]
            bg-gradient-to-tl to-[#4C17F3] from-[#a79ccc]
             flex justify-center items-center w-full h-full 
             tablet:w-full mobile:w-full min-h-[180px]"
                            >
                                <i className="icon-heart text-[70px] mobile:text-[70px] laptop:text-[100px]"></i>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <p>Liked Songs</p>
                        </CardFooter>
                    </Card>

                    {playlists && playlists.map((playlist: Playlist, index: number) => (
                        <PlaylistCard key={index} playlist={playlist} />
                    ))}
                </div>
                <div className="pb-32"></div>
            </div>
        </AppLayout>
    );
};

export default Library;
