import React from "react";
import AppLayout from "@/layouts/appLayout";
import axios from "axios";
import API_URL from "@/config/apiUrl";
import { useDispatch } from "react-redux";
import { setActiveSong } from "@/stores/player/currentAudioPlayer";
import { Song } from "@/interfaces/song";
import ListItem from "@/components/ListItem";
import { Genre } from "@/interfaces/genres";
import ErrorComponent from "@/components/error";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { NextPage } from "next";
import { ContentLoading } from "@/components/ContentLoading";
import { Image } from "@nextui-org/react";

const GenrePage: NextPage = () => {
    const dispatch = useDispatch<any>();
    const params = useParams();

    const {
        data: genre,
        error: errorGetGenre,
        isLoading,
    } = useSWR<Genre, Error>(
        params && params.id ? `${API_URL}/genres/${params.id}` : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data;
        }
    );

    // Use SWR to fetch artist
    const { data: songs, error: errorGetSongs } = useSWR<Song[], Error>(
        params && params.id ? `${API_URL}/genres/${params.id}/songs` : null,
        async (url: string) => {
            const res = await axios.get(url);
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

    if (errorGetGenre || errorGetSongs) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="px-10 pt-32 mobile:pt-20 mini-laptop:px-6 tablet:px-6 mobile:px-4">
                <div className="flex gap-3">
                    <Image src={genre?.image_link} width={150} height={150} />
                    <h1
                        className="pb-6 text-[70px] laptop:text-[60px] 
            mini-laptop:text-[60px] tablet:text-[45px] mobile:text-[40px] capitalize "
                    >
                        {genre?.name}
                    </h1>
                </div>
            </div>
            <div className="px-8 mini-laptop:px-6 tablet:px-6 mobile:px-4">
                {songs ? (
                    <h4 className="pt-8 pb-6 text-gray-400">Songs:</h4>
                ) : (
                    <h4 className="pt-8 pb-6 text-gray-400">
                        Genre do not have any song
                    </h4>
                )}
                {songs?.map((song: Song, i: number) => {
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
};

export default GenrePage;
