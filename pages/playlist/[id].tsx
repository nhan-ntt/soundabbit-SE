import React from "react";
import API_URL from "@/config/apiUrl";
import axios from "axios";
import AppLayout from "@/layouts/appLayout";
import { Song } from "@/interfaces/song";
import ListItem from "@/components/ListItem";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
    PlaylistsStatus,
    deletePlaylist,
    getPlaylists,
    playPause,
    setActiveSong,
    toggleModal,
    updatePlaylist,
} from "@/stores/player/currentAudioPlayer";
import ErrorComponent from "@/components/error";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { Playlist } from "@/interfaces/playlist";
import useSWR from "swr";
import { NextPage } from "next";
import { ContentLoading } from "@/components/ContentLoading";
import {
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const Playlist: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const params = useParams();

    const { isPlaying, playingPlaylist, playlistStatus } = useSelector(
        (state: any) => state.player
    );
    const { data: session, status } = useSession();

    const {
        data: playlist,
        error: errorGetPlaylist,
        isLoading: isLoadingPlaylist,
    } = useSWR<Playlist, Error>(
        params && params.id
            ? `${API_URL}/playlists/${params.id}`
            : null,
        async (url: string) => {
            const res = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${session?.user.token}`,
                },
            });
            return res.data;
        }
    );

    const { data: songs, error: errorGetSongs } = useSWR<Song[], Error>(
        params && params.id
            ? `${API_URL}/playlists/${params.id}/songs`
            : null,
        async (url: string) => {
            const res = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${session?.user.token}`,
                },
            });
            return res.data.list;
        }
    );

    const [playlistImage, setPlaylistImage] = useState<string>(
        playlist?.image_link || " "
    );
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (playlistStatus != PlaylistsStatus.success) {
            dispatch(getPlaylists(session?.user.token || " "));
        }
    }, []);

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
                token: session?.user.token,
                playlist_id: params.id,
            })
        );
        router.replace("/library");
    };

    if (isLoadingPlaylist) {
        return (
            <AppLayout>
                <ContentLoading />
            </AppLayout>
        );
    }

    if (errorGetPlaylist || errorGetSongs) {
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
                            {playingPlaylist !== params?.id ? (
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
                                    <DropdownItem onClick={onOpen}>
                                        Change Image
                                    </DropdownItem>
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
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Change Playlist Image
                            </ModalHeader>
                            <ModalBody>
                                <Image
                                    src={playlistImage}
                                    width={150}
                                    height={150}
                                />
                                <Input
                                    label="Image link"
                                    defaultValue={playlistImage}
                                    onChange={(e) =>
                                        setPlaylistImage(e.target.value)
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose}>Cancle</Button>
                                <Button
                                    color="primary"
                                    isDisabled={!playlistImage}
                                    onPress={() => {
                                        dispatch(
                                            updatePlaylist({
                                                token: session?.user.token,
                                                id: playlist?.id,
                                                update: {
                                                    image_link: playlistImage,
                                                },
                                            })
                                        );
                                        toast.success(
                                            "Playlist image has been updated"
                                        );
                                        onClose();
                                    }}
                                    className="bg-[#2bb540]"
                                >
                                    Change
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </AppLayout>
    );
};

export default Playlist;
