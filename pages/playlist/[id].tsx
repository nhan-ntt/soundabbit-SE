import React from "react";
import API_URL from "@/configs/apiUrl";
import axios from "axios";
import AppLayout from "@/layouts/appLayout";
import { SongProps } from "@/interfaces/Song";
import ListItem from "@/components/ListItem";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
    deletePlaylist,
    playPause,
    setActiveSong,
    toggleModal,
} from "@/stores/player/currentAudioPlayer";
import ErrorComponent from "@/components/error";
import { shadeColor } from "@/configs/utils";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react";
import {Image} from "@nextui-org/react";

function Playlist({
    data,
    songs,
    success,
}: {
    success: boolean;
    data: any;
    songs: SongProps[];
}) {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const { isPlaying, playingPlaylist, playlists } = useSelector(
        (state: any) => state.player
    );
    const { user } = useSelector((state: any) => state.auth);

    const [playlistName, setPlaylistName] = useState(data.name);

    useEffect(() => {
        const renamedPlaylistName = playlists.find(
            (playlist: any) => playlist.id == data.id
        );

        if (renamedPlaylistName) {
            setPlaylistName(renamedPlaylistName.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlists]);

    if (!success) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }

    return (
        <AppLayout title={data.name} color={data.color}>
            <div
                style={{ backgroundColor: shadeColor(data.color, -30) }}
                className=" h-[360px] pt-5 px-8 bg-gradient-to-t from-[#12121250]
       flex items-center mobile:flex-col mobile:h-full 
       tablet:flex-col tablet:h-full mobile:pt-12 tablet:pt-14
       tablet:text-center tablet:pb-3 mobile:pb-3 mobile:text-center"
            >
                <h1 className="text-[30px] font-ProximaBold  leading-[5rem] mobile:block tablet:block hidden">
                    {playlistName}
                </h1>
                <div
                    style={{
                        backgroundColor: data.color
                            ? shadeColor(data.color, -30)
                            : "#121212",
                    }}
                    className="rounded mr-6 tablet:mr-0 w-[230px] min-w-[230px] h-[230px] mobile:mr-0 relative"
                >
                    <Image src={data.cover_image} alt=""/>
                </div>
                <div>
                    <p className="uppercase font-ProximaBold text-sm tablet:hidden mobile:hidden">
                        Playlist
                    </p>
                    <h1
                        className="text-[70px] font-ProximaBold  leading-[5rem] 
          mini-laptop:text-[65px] tablet:hidden mobile:hidden line-clamp-2"
                    >
                        {playlistName}
                    </h1>
                    <p className="font-ProximaBold text-sm mt-6 tablet:mt-4 opacity-70">
                        {songs.length} Songs
                    </p>
                </div>
            </div>
            <div
                className="pt-6 px-6 tablet:px-6 mobile:px-5 min-h-[1000px]"
                style={{
                    background: `linear-gradient(180deg, ${
                        data.color ? shadeColor(data.color, -60) : "#121212"
                    } 0%, rgba(18,18,18,1) 15%)`,
                }}
            >
                <div className="px-6 mobile:px-1">
                    <div className="w-full flex items-center mb-2">
                        <Button
                            radius="full"
                            isIconOnly
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
                            className="bg-[#2bb540] hover:scale-110 flex justify-center items-center"
                        >
                            {playingPlaylist !== data.id ? (
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
                                                    playlist_name: data.name,
                                                    playlist_id: data.id,
                                                })
                                            );
                                        }}
                                    >
                                        Rename playlist
                                    </DropdownItem>
                                    <DropdownItem
                                        className="text-danger"
                                        color="danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(
                                                deletePlaylist({
                                                    token: user.token,
                                                    playlist_id: data.id,
                                                })
                                            );
                                            router.replace("/library");
                                        }}
                                    >
                                        Delete playlist
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    {songs.map((song: SongProps, i: number) => (
                        <ListItem
                            key={song.id}
                            song={song}
                            showNumber={i + 1}
                            playlist={data.id}
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

            <div className="pb-32"></div>
        </AppLayout>
    );
}

export async function getServerSideProps(context: any) {
    const userCookie = context.req.cookies.user;

    if (!userCookie) {
        return {
            redirect: {
                destination: `/login`,
                permanent: false,
            },
        };
    }

    try {
        const user = JSON.parse(userCookie);

        const playlist = await axios.get(
            `${API_URL}/playlists/${context.params.id}`,
            {
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
            }
        );

        const songs = await axios.get(
            `${API_URL}/playlists/${context.params.id}/songs`,
            {
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
            }
        );

        return {
            props: {
                success: true,
                data: playlist.data,
                songs: songs.data.list,
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

export default Playlist;
