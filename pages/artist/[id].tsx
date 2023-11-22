import React from "react";
import AppLayout from "@/layouts/appLayout";
import axios from "axios";
import API_URL from "@/config/apiUrl";
import { Artist } from "@/interfaces/artist";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setActiveSong } from "@/stores/player/currentAudioPlayer";
import { Song } from "@/interfaces/song";
import ListItem from "@/components/ListItem";
import ErrorComponent from "@/components/error";
import useSWR from "swr";
import { NextPage } from "next";

const ArtistProfile: NextPage = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const { data: artist, error: errorGetArtist } = useSWR<Artist, Error>(
        params && params.id ? `${API_URL}/artists/${params.id}` : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data;
        }
    );

    const { data: songs, error: errorGetSongs } = useSWR<Song[], Error>(
        params && params.id ? `${API_URL}/artists/${params.id}/songs` : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data.list;
        }
    );

    if (errorGetArtist || errorGetSongs) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="flex  flex-row relative w-full h-[300px]  mobile:h-[250px]">
                <div className="flex flex-col justify-end absolute w-full h-full bg-black bg-opacity-40 z-10">
                    <div
                        className="px-10 pb-10 mobile:pb-6 tablet:pb-6 mobile:px-4
                      tablet:px-6 mini-laptop:px-7"
                    >
                        <div className="flex">
                            <i className="icon-verified mr-2 text-blue-300"></i>
                            <p>
                                @
                                {artist?.name.replaceAll(" ", "").toLowerCase()}
                            </p>
                        </div>
                        <h1
                            className="text-[70px] laptop:text-[60px]
            mini-laptop:text-[60px] tablet:text-[45px] mobile:text-[40px]"
                        >
                            {artist?.name}
                        </h1>
                    </div>
                </div>
            </div>

            <div>
                <div className="pt-6 px-8 tablet:px-6 mobile:px-5">
                    <h1 className="text-2xl ">Songs</h1>
                    <div className="pt-4">
                        {songs?.map((song: Song, i: number) => (
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
};

export default ArtistProfile;
