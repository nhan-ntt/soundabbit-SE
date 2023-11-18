import React from "react";
import AppLayout from "@/layouts/appLayout";
import axios from "axios";
import API_URL from "@/configs/apiUrl";
import { Artists } from "@/interfaces/artist";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    playPause,
    setActiveSong,
} from "../../stores/player/currentAudioPlayer";
import { SongProps } from "@/interfaces/Song";
import ListItem from "@/components/ListItem";
import HorizontalSongsList from "@/components/HorizontalSongsList";
import { shadeColor } from "@/configs/utils";
import { useState } from "react";
import ErrorComponent from "@/components/error";

function ArtistProfile({
    success,
    data,
    songs,
    counts,
}: {
    data: Artists;
    success: boolean;
    songs: SongProps[];
    counts: number;
}) {
    const artist = data;
    const router = useRouter();
    const dispatch = useDispatch();
    const { isPlaying, activeSong, playingPlaylist } = useSelector(
        (state: any) => state.player
    );

    if (!success) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }
    return (
        <AppLayout title={data.display_name} color={artist.avatar.color}>
            <div
                className="relative w-full h-[400px]  mobile:h-[350px]"
                style={{
                    backgroundColor: shadeColor(artist.avatar.color, -40),
                }}
            >
                <div className="flex flex-col justify-end absolute w-full h-full bg-black bg-opacity-40 z-10">
                    <div
                        className="px-10 pb-10 mobile:pb-6 tablet:pb-6 mobile:px-4 
                      tablet:px-6 mini-laptop:px-7"
                    >
                        <div className="flex">
                            <i className="icon-verified mr-2 text-blue-300"></i>
                            <p>
                                @
                                {artist.display_name
                                    .replaceAll(" ", "")
                                    .toLowerCase()}
                            </p>
                        </div>
                        <h1
                            className="text-[70px] font-ProximaBold laptop:text-[60px] 
            mini-laptop:text-[60px] tablet:text-[45px] mobile:text-[40px]"
                        >
                            {artist.display_name}
                        </h1>
                        <p>{counts.toLocaleString()} monthly downloads</p>
                    </div>
                </div>

                <Image src={artist.avatar.url} />
            </div>
            <div
                style={{
                    background: `linear-gradient(180deg, ${shadeColor(
                        artist.avatar.color,
                        -30
                    )} 0%, rgba(18,18,18,1) 15%)`,
                }}
            >
                <div
                    className="h-full bg-gradient-to-t from-[#121212]
                 via-[#121212f0] to-[#12121298] w-full transition-colors
                  px-8 pt-6 mini-laptop:px-6 tablet:px-6 mobile:px-5"
                >
                    <div className="pt-6">
                        <div className="w-full flex justify-between">
                            <h1 className="text-2xl font-ProximaBold">
                                Popular
                            </h1>
                            <div
                                onClick={() => {
                                    if (playingPlaylist !== data.id) {
                                        dispatch(
                                            setActiveSong({
                                                songs: songs,
                                                index: 0,
                                                playlist: data.id,
                                            })
                                        );
                                    } else {
                                        dispatch(playPause(!isPlaying));
                                    }
                                }}
                                className="bg-[#2bb540] rounded-full cursor-pointer hover:scale-110
                     w-[45px] h-[45px] flex justify-center items-center"
                            >
                                {activeSong.artist_id != artist.id ? (
                                    <i className="icon-play text-[20px] ml-1 text-black " />
                                ) : !isPlaying ? (
                                    <i className="icon-play text-[20px] ml-1 text-black" />
                                ) : (
                                    <i className="icon-pause text-[20px] text-black" />
                                )}
                            </div>
                        </div>

                        <div className="max-w-[700px] pt-4">
                            {songs
                                .slice(0, 5)
                                .map((song: SongProps, i: number) => (
                                    <ListItem
                                        key={song.id}
                                        song={song}
                                        showNumber={i + 1}
                                        onTap={() => {
                                            dispatch(
                                                setActiveSong({
                                                    songs: songs,
                                                    index: songs.indexOf(song),
                                                    playlist: data.id,
                                                })
                                            );
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                    <div className="pt-6">
                        <h1 className="text-2xl font-ProximaBold pb-6">
                            Older Releases
                        </h1>
                    </div>
                </div>
                <HorizontalSongsList songs={songs.slice(5, 15)} />
                <div className="pt-6 px-8 tablet:px-6 mobile:px-5">
                    <h1 className="text-2xl font-ProximaBold">All</h1>
                    <div className="pt-4">
                        {songs.map((song: SongProps, i: number) => (
                            <ListItem
                                key={song.id}
                                song={song}
                                showNumber={i + 1}
                                onTap={() => {
                                    dispatch(
                                        setActiveSong({
                                            songs: songs,
                                            index: songs.indexOf(song),
                                            playlist: data.id,
                                        })
                                    );
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="pb-32"></div>
        </AppLayout>
    );
}

function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getServerSideProps(context: any) {
    try {
        const { data } = await axios.get(
            API_URL + "/artists/" + context.params.id
        );
        const songs = await axios.get(
            API_URL + "/songs/artist/" + context.params.id
        );
        return {
            props: {
                success: true,
                data: data.data[0],
                songs: songs.data.data,
                counts: getRndInteger(20000000, 500000000),
            },
        };
    } catch (e) {
        return {
            props: {
                success: false,
            },
        };
    }
}

export default ArtistProfile;
