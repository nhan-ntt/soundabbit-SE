import React from "react";
import AppLayout from "@/layouts/appLayout";
import axios from "axios";
import API_URL from "@/configs/apiUrl";
import { Artists } from "@/interfaces/artist";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setActiveSong } from "../../stores/player/currentAudioPlayer";
import { SongProps } from "@/interfaces/Song";
import ListItem from "@/components/ListItem";
import { tags } from "@/interfaces/genres";
import HorizontalArtistsList from "@/components/HorizontalArtistsList";
import { useState } from "react";
import { capitalize } from "@/configs/utils";
import ErrorComponent from "@/components/error";

function GenrePage({
    artists,
    songs,
    tag,
    success,
}: {
    tag: any;
    success: boolean;
    artists: Artists[];
    songs: SongProps[];
}) {
    const dispatch = useDispatch();
    const router = useRouter();

    if (!success) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }
    return (
        <AppLayout
            title={capitalize(tag.tag)}
            color={"#" + tag.color.toString(16)}
        >
            <div className="px-10 pt-32 mobile:pt-20 mini-laptop:px-6 tablet:px-6 mobile:px-4">
                <h1
                    className="pb-6 text-[70px] laptop:text-[60px] 
            mini-laptop:text-[60px] tablet:text-[45px] mobile:text-[40px] capitalize font-ProximaBold"
                >
                    {tag.tag}
                </h1>
                <h4 className="font-ProximaBold pb-6 text-gray-400">
                    Related Artists:
                </h4>
            </div>
            <HorizontalArtistsList artists={artists} />
            <div className="px-8 mini-laptop:px-6 tablet:px-6 mobile:px-4">
                <h4 className="pt-8 font-ProximaBold pb-6 text-gray-400">
                    Popular Songs:
                </h4>
                {songs.map((song: SongProps, i: number) => {
                    return (
                        <ListItem
                            onTap={() => {
                                dispatch(
                                    setActiveSong({ songs: songs, index: i })
                                );
                            }}
                            key={song.id}
                            song={song}
                            showNumber={i + 1}
                        />
                    );
                })}
            </div>
            <div className="pb-32"></div>
        </AppLayout>
    );
}

export async function getServerSideProps(context: any) {
    try {
        const { data } = await axios.get(
            API_URL + "/songs/tag/" + context.params.id
        );
        const songs = await axios.get(
            API_URL + "/artists/tag/" + context.params.id
        );
        const tag = tags.find((tag: any) => {
            return tag.tag == context.params.id;
        });
        return {
            props: {
                success: true,
                tag: tag,
                songs: data.data,
                artists: songs.data.data,
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

export default GenrePage;
