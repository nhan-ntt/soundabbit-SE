import React from "react";
import { API } from "@/config/api";
import axios from "axios";
import AppLayout from "@/layouts/appLayout";
import { Song } from "@/interfaces/song";
import ListItem from "@/components/ListItem";
import { useDispatch, useSelector } from "react-redux";
import { playPause, setActiveSong } from "@/stores/player/currentAudioPlayer";
import ErrorComponent from "@/components/error";
import { Button } from "@nextui-org/react";
import useSWR from "swr";
import { NextPage } from "next";
import { ContentLoading } from "@/components/ContentLoading";
import { useSession } from "next-auth/react";

const Liked: NextPage = () => {
    const dispatch = useDispatch();
    const { isPlaying, playingPlaylist } = useSelector(
        (state: any) => state.player
    );
    const { data: session, status } = useSession();

    const { data: songs, error, isLoading } = useSWR<Song[], Error>(
        API.favoriteSongs({ userID: session?.user.id }),
        async (url: string) => {
            const res = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${session?.user.token}`,
                },
            });
            return res.data.list;
        }
    );

    if (isLoading) {
        return (
            <AppLayout>
                <ContentLoading />
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div
                className="h-[350px] pt-5 px-8
       flex items-center mobile:flex-col mobile:h-full 
       tablet:flex-col tablet:h-full mobile:pt-12 tablet:pt-14
       tablet:text-center tablet:pb-3 mobile:pb-3 mobile:text-center"
            >
                <h1 className="text-[30px] leading-[5rem] mobile:block tablet:block hidden">
                    Liked Songs
                </h1>
                <div
                    className="w-fit bg-opacity-70 rounded bg-gradient-to-tl to-[#4C17F3] from-[#ddd7d7]
         p-16 flex items-center mr-6 tablet:p-14 tablet:mr-0 mobile:mr-0 mobile:p-10"
                >
                    <i className="icon-heart text-[100px]"></i>
                </div>
                <div>
                    <p className="uppercase text-sm tablet:hidden mobile:hidden">
                        Playlist
                    </p>
                    <h1
                        className="text-[70px]  leading-[5rem] 
          mini-laptop:text-[65px] tablet:hidden mobile:hidden"
                    >
                        Liked Songs
                    </h1>
                    <p className="text-sm mt-6 tablet:mt-4 opacity-70">
                        {songs?.length} Songs
                    </p>
                </div>
            </div>
            <div className="pt-6 px-6 tablet:px-6 mobile:px-4 min-h-[500px]">
                <div className="px-6 mobile:px-1">
                    <div className="w-full flex justify-between mb-2">
                        <Button
                            isIconOnly
                            radius="full"
                            onClick={() => {
                                if (playingPlaylist !== "LIKED") {
                                    dispatch(
                                        setActiveSong({
                                            songs: songs,
                                            index: 0,
                                            playlist: "LIKED",
                                        })
                                    );
                                } else {
                                    dispatch(playPause(!isPlaying));
                                }
                            }}
                            className="bg-[#2bb540] cursor-pointer hover:scale-110
                     w-[45px] h-[45px] flex justify-center items-center"
                        >
                            {playingPlaylist !== "LIKED" ? (
                                <i className="icon-play text-[20px] ml-1 text-black " />
                            ) : !isPlaying ? (
                                <i className="icon-play text-[20px] ml-1 text-black" />
                            ) : (
                                <i className="icon-pause text-[20px] text-black" />
                            )}
                        </Button>
                    </div>
                </div>
                <div className="pt-4">
                    {songs &&
                        songs?.map((song: Song, i: number) => (
                            <ListItem
                                key={song.id}
                                song={song}
                                showNumber={i + 1}
                                onTap={() => {
                                    dispatch(
                                        setActiveSong({
                                            songs: songs,
                                            index: songs?.indexOf(song),
                                            playlist: "LIKED",
                                        })
                                    );
                                }}
                            />
                        ))}
                </div>
            </div>

            <div className="pb-32"></div>
        </AppLayout>
    );
};

export default Liked;
