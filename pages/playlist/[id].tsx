import React from "react";
import API_URL from "@/config/apiUrl";
import axios from "axios";
import AppLayout from "@/layouts/appLayout";
import { Song } from "@/interfaces/song";
import ListItem from "@/components/ListItem";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
    PlaylistsStatus,
    deletePlaylist,
    getPlaylists,
    playPause,
    setActiveSong,
    toggleModal,
} from "@/stores/player/currentAudioPlayer";
import ErrorComponent from "@/components/error";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { Playlist } from "@/interfaces/playlist";
import useSWR from "swr";
import { NextPage } from "next";

const Playlist: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const params = useParams();

    const { isPlaying, playingPlaylist, playlists, playlistStatus } =
        useSelector((state: any) => state.player);
    const { user } = useSelector((state: any) => state.auth);
    const [playlist, setPlaylist] = useState<Playlist>();

    const { data: songs, error: errorGetSongs } = useSWR<Song[], Error>(
        params && params.id ? `${API_URL}/playlists/${params.id}/songs` : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data.list;
        }
    );

    useEffect(() => {
        if (playlistStatus != PlaylistsStatus.success) {
            dispatch(getPlaylists(user.token));
        }
    }, []);

    useEffect(() => {
        if (params && params.id) {
            setPlaylist(
                playlists.find((playlist: any) => playlist.id == params.id)
            );
        }
    }, [playlists, params]);

    const playPlaylist = () => {
        if (songs?.length == 0) {
            return;
        }

        if (playingPlaylist !== params.id) {
            dispatch(
                setActiveSong({
                    songs: songs,
                    index: 0,
                    playlist: params.id,
                })
            );
        } else {
            dispatch(playPause(!isPlaying));
        }
    };

    const onDeletePlaylist = () => {
        dispatch(
            deletePlaylist({
                token: user.token,
                playlist_id: params.id,
            })
        );
        router.replace("/library");
    };

    if (!errorGetSongs) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div
                className=" h-[360px] pt-5 px-8 bg-gradient-to-t from-[#12121250]
       flex items-center mobile:flex-col mobile:h-full 
       tablet:flex-col tablet:h-full mobile:pt-12 tablet:pt-14
       tablet:text-center tablet:pb-3 mobile:pb-3 mobile:text-center"
            >
                <h1 className="text-[30px]  leading-[5rem] mobile:block tablet:block hidden">
                    {playlist?.name}
                </h1>
                <Image
                    className="mr-6 tablet:mr-0 w-[230px] min-w-[230px] h-[230px] mobile:mr-0 object-cover"
                    src={playlist?.image_link}
                    alt=""
                />
                <div>
                    <p className="uppercase text-sm tablet:hidden mobile:hidden">
                        Playlist
                    </p>
                    <h1
                        className="text-[70px]  leading-[5rem] 
          mini-laptop:text-[65px] tablet:hidden mobile:hidden line-clamp-2"
                    >
                        {playlist?.name}
                    </h1>
                    <p className="text-sm mt-6 tablet:mt-4 opacity-70">
                        {songs?.length} Songs
                    </p>
                </div>
            </div>
            <div className="pt-6 px-6 tablet:px-6 mobile:px-5 min-h-[1000px]">
                <div className="px-6 mobile:px-1">
                    <div className="w-full flex items-center mb-2">
                        <Button
                            radius="full"
                            isDisabled={songs?.length == 0}
                            isIconOnly
                            onClick={playPlaylist}
                            className="bg-[#2bb540] hover:scale-110 flex justify-center items-center"
                        >
                            {playingPlaylist !== params.id ? (
                                <i className="icon-play text-[20px] ml-1 text-black " />
                            ) : !isPlaying ? (
                                <i className="icon-play text-[20px] ml-1 text-black" />
                            ) : (
                                <i className="icon-pause text-[20px] text-black" />
                            )}
                        </Button>

                        <div className="relative">
                            <Dropdown placement="bottom-start">
                                <DropdownTrigger>
                                    <i
                                        className="cursor-pointer mx-4 icon-more-horizontal text-[30px]
               text-slate-400 hover:text-white "
                                    ></i>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(
                                                toggleModal({
                                                    data: true,
                                                    song_id: "RENAME",
                                                    playlist_name:
                                                        playlist?.name,
                                                    playlist_id: playlist?.id,
                                                })
                                            );
                                        }}
                                    >
                                        Rename playlist
                                    </DropdownItem>
                                    <DropdownItem
                                        className="text-danger"
                                        color="danger"
                                        onClick={onDeletePlaylist}
                                    >
                                        Delete playlist
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    {songs?.map((song: Song, i: number) => (
                        <ListItem
                            key={song.id}
                            song={song}
                            showNumber={i + 1}
                            playlist={playlist}
                            onTap={() => {
                                dispatch(
                                    setActiveSong({
                                        songs: songs,
                                        index: songs.indexOf(song),
                                        playlist: params.id,
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

export default Playlist;
