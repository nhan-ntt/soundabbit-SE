import React, { useEffect } from "react";
import AppLayout from "@/layouts/appLayout";
import axios from "axios";
import API_URL from "@/config/apiUrl";
import { useDispatch } from "react-redux";
import { setActiveSong } from "@/stores/player/currentAudioPlayer";
import { Song } from "@/interfaces/song";
import ListItem from "@/components/ListItem";
import { Genre } from "@/interfaces/genres";
import ErrorComponent from "@/components/error";

function GenrePage({
    genre,
    songs,
    success,
}: {
    success: boolean;
    genre: Genre;
    songs: Song[];
}) {
    const dispatch = useDispatch<any>();

    if (!success) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="px-10 pt-32 mobile:pt-20 mini-laptop:px-6 tablet:px-6 mobile:px-4">
                <h1
                    className="pb-6 text-[70px] laptop:text-[60px] 
            mini-laptop:text-[60px] tablet:text-[45px] mobile:text-[40px] capitalize "
                >
                    {genre!.name}
                </h1>
            </div>
            <div className="px-8 mini-laptop:px-6 tablet:px-6 mobile:px-4">
                {songs ? (
                    <h4 className="pt-8 pb-6 text-gray-400">
                        Songs:
                    </h4>

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
}

export async function getServerSideProps(context: any) {
    try {
        const genre = await axios.get(`${API_URL}/genres/${context.params.id}`);

        return {
            props: {
                success: true,
                genre: genre.data
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
