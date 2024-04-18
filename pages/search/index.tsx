import React, { useEffect } from "react";
import AppLayout from "@/layouts/appLayout";
import algoliaClient from "@/config/algolia";
import { useState } from "react";
import { Artist } from "@/interfaces/artist";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSong } from "@/stores/player/currentAudioPlayer";
import { PlayPauseButton } from "@/components/HorizontalSongCard";
import ListItem from "@/components/ListItem";
import Link from "next/link";
import { Image, Input } from "@nextui-org/react";
import useSWR from "swr";
import API_URL from "@/config/apiUrl";
import axios from "axios";
import { Genre } from "@/interfaces/genres";
import { NextPage } from "next";
import { Song } from "@/interfaces/song";

const Search: NextPage = () => {
    const [searchResult, setSearchResult] = useState<Song[]>([]);
    const [topResult, setTopResult] = useState<any>();
    const [isFocus, setFocus] = useState(false);

    const dispatch = useDispatch<any>();
    const { data: genres } = useSWR<Genre[], Error>(
        `${API_URL}/genres`,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data.list;
        }
    );

    const toSongProps = (songs: any): Song[] => {
        return songs.map((song: any) => {
            return {
                id: song.objectID,
                name: song.name,
                audio_link: song.audio_link,
                image_link: song.image_link,
                streams: song.streams,
            };
        });
    };

    // get response from algolia
    const searchAlgolia = async (query: string) => {
        if (query.length == 0) {
            setFocus(false);
            return;
        }

        setFocus(true);
        const data = await algoliaClient.search(query);
        if (data.hits.length !== 0) {
            // @ts-ignore comment
            setTopResult({
                type: "song",
                ...data.hits[0],
            });
        }

        setSearchResult(toSongProps(data.hits));
    };

    return (
        <AppLayout>
            <div className="w-full">
                <div
                    className="py-4 px-6 mobile:py-2 mobile:px-4 tablet:px-4 fixed z-40 bg-black/70  backdrop-blur-sm flex flex-row 
        w-[calc(100vw_-_14rem_-_16px)] mini-laptop:w-[calc(100vw_-_55px)] 
        tablet:w-screen mobile:w-screen items-center"
                >
                    <Input
                        radius="full"
                        startContent={
                            <i className="icon-search text-gray-500"></i>
                        }
                        onChange={(e: any) => searchAlgolia(e.target.value)}
                        type="text"
                        className="tablet:w-full mobile:w-full w-[500px]"
                        placeholder="Search Music.."
                    />
                </div>
            </div>

            {isFocus ? (
                <div>
                    {searchResult.length == 0 ? (
                        <div className="w-full text-center pt-10"></div>
                    ) : (
                        <div>
                            <div className="pt-24 mobile:pt-14 tablet:pt-14"></div>

                            <div
                                className="overflow-y-hidden flex px-8 mini-laptop:px-4 
          justify-items-stretch items-stretch tablet:flex-col mobile:flex-col mobile:px-4 tablet:px-6"
                            >
                                <div className="laptop:w-[26rem] w-[32rem] tablet:w-full mobile:w-full">
                                    <h1 className="mobile:hidden tablet:hidden my-4 text-xl ">
                                        Top Result
                                    </h1>

                                    {topResult && (
                                        <TopResult
                                            object={topResult}
                                            onTap={() =>
                                                dispatch(
                                                    setActiveSong({
                                                        songs: searchResult,
                                                        index: 0,
                                                    })
                                                )
                                            }
                                        />
                                    )}
                                </div>
                                <div className="w-full ml-6 tablet:m-0 tablet:mt-2 mobile:mt-2 mobile:ml-0">
                                    <h1 className="my-4 text-xl ">Top Songs</h1>

                                    {searchResult
                                        .slice(0, 4)
                                        .map((song: Song, i: number) => {
                                            return (
                                                <ListItem
                                                    onTap={() =>
                                                        dispatch(
                                                            setActiveSong({
                                                                songs: searchResult,
                                                                index: i,
                                                            })
                                                        )
                                                    }
                                                    key={song.id}
                                                    song={song}
                                                />
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="pt-28 mobile:pt-20 tablet:pt-20"></div>

                    <h1 className="mobile:text-xl text-2xl px-8 mini-laptop:px-4 mobile:px-4 ">
                        Genres
                    </h1>
                    <div
                        className="grid grid-cols-5 laptop:grid-cols-4 mini-laptop:grid-cols-3 mini-laptop:gap-4
           laptop:gap-4 gap-6 px-8 laptop:px-6 mini-laptop:px-4
            pt-4 select-none tablet:grid-cols-2 mobile:grid-cols-2 mobile:px-4 mobile:gap-4"
                    >
                        {genres &&
                            genres.map((genre: Genre) => {
                                return (
                                    <Link
                                        href={`/genre/${genre.id}`}
                                        key={genre.id}
                                    >
                                        <div
                                            className="hover:scale-105 transition-all cursor-pointer relative h-44 tablet:h-40 mobile:h-28 overflow-hidden rounded "
                                            style={{
                                                backgroundColor: "black",
                                            }}
                                        >
                                            <div className="p-4 capitalize">
                                                <p className="text-xl">
                                                    {genre.name}
                                                </p>
                                                <div className="absolute -right-4 -bottom-2">
                                                    <div className="shadow-xl relative mobile:w-[70px] rounded mobile:h-[70px] w-24 h-24 rotate-[30deg]">
                                                        <Image
                                                            src={
                                                                genre.image_link
                                                            }
                                                            alt=""
                                                            className="object-cover rounded mobile:w-[70px] mobile:h-[70px] w-24 h-24"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            )}
            <div className="mb-32"></div>
        </AppLayout>
    );
};
export default Search;

function TopResult({ object, onTap }: any) {
    const [showPlayButton, setPlayButton] = useState(false);
    const { activeSong, isPlaying } = useSelector((state: any) => state.player);
    const { data: artists, error: errorGetSongs } = useSWR<Artist[], Error>(
        object && object.id ? `${API_URL}/songs/${object.id}/artists` : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data.list;
        }
    );

    if (object.type == "song") {
        return (
            <div
                onClick={onTap}
                onMouseEnter={() => setPlayButton(true)}
                onMouseLeave={() => setPlayButton(false)}
                className="mobile:hidden tablet:hidden h-[250px] flex flex-col bg-[#5f5d5d2f] relative
              hover:bg-[#5f5d5d72] rounded tablet:h-full mobile:h-full"
            >
                <div>
                    {activeSong?.id === object.id ? (
                        <PlayPauseButton
                            condition={activeSong?.id === object.id}
                            isPlaying={isPlaying}
                        />
                    ) : showPlayButton ? (
                        <PlayPauseButton
                            condition={showPlayButton}
                            isHover
                            isPlaying={isPlaying}
                        />
                    ) : null}

                    <div className="p-6 tablet:flex mobile:flex ">
                        <div className="rounded relative w-24 h-24 ">
                            <Image
                                alt=""
                                src={object.image_link}
                                className="object-cover rounded w-24 h-24"
                            />
                        </div>
                        <div className="tablet:mx-4 mobile:mx-4">
                            <p className="truncate mt-4 text-2xl">
                                {object.name}
                            </p>
                            <p>
                                {artists &&
                                    artists.map((artist: Artist) => (
                                        <Link
                                            key={artist.id}
                                            href={`/artist/${artist.id}`}
                                            className="text-gray-300"
                                        >
                                            {artist.name}
                                        </Link>
                                    ))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link href={`/artist/${object.artist_id}`}>
            <div
                className=" mobile:hidden tablet:hidden h-[250px] flex flex-col p-6 bg-[#5f5d5d2f] 
              hover:bg-[#5f5d5d72] rounded tablet:h-full mobile:h-full"
            >
                <div className="rounded-full relative w-24 h-24">
                    <Image
                        src={object.image_link}
                        alt=""
                        className="rounded-full"
                    />
                </div>

                <p className="mt-4 text-2xl line-clamp-1">{object.name}</p>
                <p>Artist</p>
            </div>
        </Link>
    );
}
