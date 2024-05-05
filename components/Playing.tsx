import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Image, Modal, ModalContent } from "@nextui-org/react";
import {
    IStateProps,
    nextSong,
    playPause,
    setVolume,
    setCurrentTime,
    onRepeat,
    onShuffle,
    toggleModal,
    setSeekTime,
} from "@/stores/player/currentAudioPlayer";
import { useRouter } from "next/router";
import Controls from "@/components/AudioPlayer/Controls";
import SeekBar from "@/components/AudioPlayer/SeekBar";
import VolumeControls from "@/components/AudioPlayer/VolumeControls";
import Link from "next/link";
import LikeButton from "@/components/AudioPlayer/LikeButton";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tooltip,
} from "@nextui-org/react";
import useSWR from "swr";
import { Artist } from "@/interfaces/artist";
import axios from "axios";
import { API } from "@/config/api";

export default function Playing({ isOpen, handleClose }: any) {
    const {
        isPlaying,
        activeSong,
        currentIndex,
        currentTime,
        volume,
        duration,
        queue: songs,
        isShuffle,
        isRepeat,
    }: IStateProps = useSelector((state: any) => state.player);
    const router = useRouter();

    const dispatch = useDispatch<any>();
    const [seekBarColor, setSeekBarColor] = useState("#fff");
    const changeSeekBarColor = (color: string) => setSeekBarColor(color);
    const { data: artists } = useSWR<Artist[], Error>(
        activeSong?.id
            ? API.songArtists({ songID: activeSong.id })
            : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data.list;
        }
    );

    const toNextSong = () => {
        let nextSongIndex = currentIndex + 1;
        if (isShuffle) {
            nextSongIndex = Math.floor(Math.random() * songs.length)
        }
        dispatch(nextSong(nextSongIndex));
    };

    const toPrevSong = () => {
        let nextSongIndex = currentIndex - 1;
        if (isShuffle) {
            nextSongIndex = Math.floor(Math.random() * songs.length)
        }
        dispatch(nextSong(nextSongIndex));
    };

    const onScrub = (value: any) => {
        dispatch(setSeekTime(value));
        dispatch(setCurrentTime(value));
    };

    const onScrubEnd = () => {
        if (!isPlaying) {
            dispatch(playPause(true));
        }
    };

    const updateVolume = (e: any) => {
        dispatch(setVolume(e));
    };

    const currentPercentage = () => duration ? `${(currentTime / duration) * 100}%` : "0%";

    const songStyling = `
        -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage()}, ${seekBarColor}), color-stop(${currentPercentage()}, #777))
        `;

    if (!activeSong) {
        return
    }

    return (
        <Modal
            size={"full"}
            isOpen={isOpen}
            hideCloseButton
        >
            <ModalContent className="relative overflow-hidden">
                <Image
                    src="/bg-gradient-right.png"
                    width={1833}
                    height={1822}
                    className="absolute dark:opacity-70 -top-[40%] -right-[30%] mobile:-right-[10%] mobile:-top-0 tablet:-right-[10%] tablet:-top-0 z-10 rotate-12"
                />
                <Image
                    src="/bg-gradient-left.png"
                    width={1266}
                    height={1211}
                    className="absolute dark:md:block dark:opacity-70 -left-[20%] z-10"
                />
                <div className="w-full h-full z-20">
                    <div
                        className="backdrop-blur-[100px] w-full h-full flex flex-row 
        items-center justify-center
        tablet:block mobile:block"
                        onClick={() => handleClose()}
                    >
                        <div
                            className="m-auto  flex flex-row 
        justify-center items-center tablet:items-start mobile:items-start"
                            onClick={(e) => { e.stopPropagation() }}>
                            <SongCoverImage
                                activeSong={activeSong}
                                className="tablet:hidden mobile:hidden"
                            />
                            <div
                                className="flex flex-col h-[450px] laptop:h-[400px] mini-laptop:h-[400px]
        justify-between items-center px-6 py-2 tablet:mt-4 mobile:mt-4
        mobile:h-screen"
                            >
                                <div
                                    className="flex flex-row justify-between items-center
        text-white tablet:w-[400px] 
        mobile:w-[340px] w-full tablet:mb-8 mobile:mb-"
                                >
                                    <Tooltip content="Go back">
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            size="sm"
                                            onClick={() => handleClose()}
                                            className="hover:bg-white hover:text-black text-gray-100 shadow flex 
        items-center justify-center"
                                        >
                                            <i className="icon-chevron-down text-[20px] mobile:text-[20px]"></i>
                                        </Button>
                                    </Tooltip>

                                    <div className="flex flex-row items-center">
                                        <h1
                                            className="text-center uppercase mx-2 
        tracking-wider mini-laptop:text-base tablet:text-base mobile:text-base"
                                        >
                                            Now Playing
                                        </h1>
                                    </div>
                                    <div
                                        className="w-8 h-8 shadow flex 
        items-center justify-center rounded cursor-pointer"
                                    >
                                        <div className="relative">
                                            <Dropdown placement="bottom-end">
                                                <DropdownTrigger>
                                                    <i
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        className=" icon-more-horizontal text-[22px] text-gray-300 hover:text-white"
                                                    ></i>
                                                </DropdownTrigger>

                                                <DropdownMenu aria-label="Static Actions">
                                                    <DropdownItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch(
                                                                toggleModal({
                                                                    data: true,
                                                                    song_id:
                                                                        activeSong?.id,
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        Add to Playlist
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>

                                <SongCoverImage
                                    activeSong={activeSong}
                                    className="hidden tablet:block mobile:block tablet:my-4 tablet:mb-6 mobile:mb-6 mobile:my-4"
                                />
                                <div className="flex flex-col justify-center items-center mobile:pb-14">
                                    <div
                                        className="mb-10 mini-laptop:w-[320px] laptop:w-[350px] desktop:w-[28rem]
w-full tablet:w-[400px] mobile:w-[320px] flex flex-row justify-between items-center"
                                    >
                                        <div>
                                            <p
                                                className="text-gray-300
cursor-pointer line-clamp-1 mobile:text-sm text-lg mini-laptop:text-base 
tablet:text-base"
                                            >
                                                {activeSong!.name}
                                            </p>
                                            <p
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="text-gray-400 text-sm mini-laptop:text-sm
tablet:text-sm mobile:text-xs hover:underline cursor-pointer"
                                            >
                                                {artists &&
                                                    artists.map(
                                                        (
                                                            artist: Artist,
                                                            index: number
                                                        ) => (
                                                            <>
                                                                <Link
                                                                    href={`/artist/${artist.id}`}
                                                                    className="text-gray-300"
                                                                >
                                                                    {artist.name}
                                                                </Link>
                                                                {index <
                                                                    artists.length -
                                                                    1 && ", "}
                                                            </>
                                                        )
                                                    )}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <LikeButton
                                                song_id={activeSong?.id}
                                                size={"text-[24px]"}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <SeekBar
                                            changeSeekBarColor={changeSeekBarColor}
                                            isFullScreen={true}
                                            songProgress={currentTime}
                                            duration={duration}
                                            onScrubEnd={onScrubEnd}
                                            onScrub={onScrub}
                                            songBarStyling={songStyling}
                                        />
                                        <Controls
                                            isFullScreen={true}
                                            isShuffle={isShuffle}
                                            isRepeat={isRepeat}
                                            onRepeat={() =>
                                                dispatch(onRepeat(!isRepeat))
                                            }
                                            onShuffle={() =>
                                                dispatch(onShuffle(!isShuffle))
                                            }
                                            playPause={() =>
                                                dispatch(playPause(!isPlaying))
                                            }
                                            isPlaying={isPlaying}
                                            nextSong={toNextSong}
                                            prevSong={toPrevSong}
                                        />
                                    </div>

                                    <div
                                        className="flex flex-row justify-between mt-10 w-full 
tablet:w-[400px] mobile:w-[320px]"
                                    >
                                        <VolumeControls
                                            isFullScreen={true}
                                            updateVolume={updateVolume}
                                            volume={volume}
                                        />
                                        <div>
                                            <Tooltip content="Download">
                                                <Link
                                                    href={
                                                        activeSong?.audio_link +
                                                        `?filename=${activeSong?.audio_link}.mp3`
                                                    }
                                                    download={
                                                        activeSong?.audio_link
                                                    }
                                                    target="_blank"
                                                >
                                                    <i
                                                        className="icon-download text-gray-400 text-[20px]
hover:text-white cursor-pointer mx-3 mobile:text-[14px]"
                                                    ></i>
                                                </Link>
                                            </Tooltip>

                                            <Tooltip content="Queue">
                                                <i
                                                    onClick={() => {
                                                        handleClose()
                                                        router.push("/queue")
                                                    }
                                                    }
                                                    className="icon-queue text-gray-400 text-[18px]
hover:text-white cursor-pointer ml-3 mobile:text-[14px]"
                                                ></i>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden mobile:block tablet:block h-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    );
}

function SongCoverImage({ activeSong, className }: any) {
    return (
        <div
            className={
                `w-[450px] h-[450px] min-w-[450px]
        relative mx-10 mini-laptop:mx-4
        laptop:w-[400px] laptop:h-[400px] laptop:min-w-[400px]
        tablet:w-[400px] tablet:h-[400px] tablet:min-w-[400px] tablet:min-h-[400px]
        mobile:w-[320px] mobile:h-[320px] mobile:min-w-[320px] mobile:min-h-[320px]
        mini-laptop:w-[370px] mini-laptop:h-[370px] 
        mini-laptop:min-w-[370px] rounded ` + className
            }
        >
            <Image
                src={activeSong!.image_link}
                width={450}
                height={450}
                alt=""
                className="
w-[450px] h-[450px] min-w-[450px]
        mini-laptop:mx-4
        laptop:w-[400px] laptop:h-[400px] laptop:min-w-[400px]
        tablet:w-[400px] tablet:h-[400px] tablet:min-w-[400px] tablet:min-h-[400px]
        mobile:w-[320px] mobile:h-[320px] mobile:min-w-[320px] mobile:min-h-[320px]
        mini-laptop:w-[370px] mini-laptop:h-[370px] 
        mini-laptop:min-w-[370px] object-cover rounded-2xl shadow-2xl"
            />
        </div>
    );
}
