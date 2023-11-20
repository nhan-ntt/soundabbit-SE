import React from "react";
import AppLayout from "@/layouts/appLayout";
import axios from "axios";
import API_URL from "@/config/apiUrl";
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
import { shadeColor } from "@/config/utils";
import { useState } from "react";
import ErrorComponent from "@/components/error";
import { Image } from "@nextui-org/react";

function ArtistProfile({
    success,
    artist,
    songs,
}: {
    artist: Artists;
    success: boolean;
    songs: SongProps[];
}) {
    const dispatch = useDispatch();

    if (!success) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="relative w-full h-[300px]  mobile:h-[250px]">
                <div className="flex flex-col justify-end absolute w-full h-full bg-black bg-opacity-40 z-10">
                    <div
                        className="px-10 pb-10 mobile:pb-6 tablet:pb-6 mobile:px-4
                      tablet:px-6 mini-laptop:px-7"
                    >
                        <div className="flex">
                            <i className="icon-verified mr-2 text-blue-300"></i>
                            <p>
                                @{artist.name.replaceAll(" ", "").toLowerCase()}
                            </p>
                        </div>
                        <h1
                            className="text-[70px] laptop:text-[60px]
            mini-laptop:text-[60px] tablet:text-[45px] mobile:text-[40px]"
                        >
                            {artist.name}
                        </h1>
                    </div>
                </div>

                <Image src={artist.avatar} alt="Avatar" />
            </div>

            <div>
                <div className="pt-6 px-8 tablet:px-6 mobile:px-5">
                    <h1 className="text-2xl ">Songs</h1>
                    <div className="pt-4">
                        {songs?.map((song: SongProps, i: number) => (
                            <ListItem
                                key={song.id}
                                song={song}
                                showNumber={i + 1}
                                onTap={() => {
                                    dispatch(
                                        setActiveSong({
                                            songs: songs,
                                            index: songs.indexOf(song),
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

export async function getServerSideProps(context: any) {
    try {
        const artist = await axios.get(`${API_URL}/artists/${context.params.id}`);
        console.log(artist.data);
        console.log(`${API_URL}/artists/${context.params.id}`);

        // const songs = await axios.get(
        //     API_URL + "/songs/artist/" + context.params.id
        // );

        return {
            props: {
                success: true,
                artist: artist.data,
                // songs: songs.data.data,
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
