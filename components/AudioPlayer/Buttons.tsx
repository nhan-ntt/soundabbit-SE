import React from "react";
import LikeButton from "./LikeButton";
import VolumeControls from "./VolumeControls";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tooltip } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import {
    toggleModal,
} from "@/stores/player/currentAudioPlayer";
import clsx from "clsx";

interface IProps {
    volume: number;
    updateVolume: (e: any) => void;
    className: string;
    showVolumeSeekBar: boolean;
    song_id: string;
    download_url: string;
}

function Buttons({
    volume,
    updateVolume,
    className,
    showVolumeSeekBar,
    song_id,
    download_url,
}: IProps) {
    const router = useRouter();
    const dispatch = useDispatch<any>();

    return (
        <div
            className={clsx(`w-full flex flex-row justify-end items-center`, className)}
        >
            <div
                className="flex flex-row items-center gap-1"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <LikeButton song_id={song_id} />

                <Tooltip content="Add to playlist">
                    <div
                        className="cursor-pointer: song.id"
                        onClick={() => {
                            dispatch(
                                toggleModal({
                                    data: true,
                                    song_id,
                                })
                            );
                        }}
                    >
                        <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6 12H18"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 18V6"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </Tooltip>

                <Tooltip content="Download">
                    <Link
                        href={download_url + `?filename=${song_id}.mp3`}
                        download={`${song_id}.mp3`}
                        target="_blank"
                    >
                        <i
                            className="icon-download text-gray-400 text-[16px]
           hover:text-white cursor-pointer mx-2"
                        ></i>
                    </Link>
                </Tooltip>

                <Tooltip content="Queue">
                    <i
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push("/queue");
                        }}
                        className="icon-queue text-gray-400 text-[14px]
           hover:text-white cursor-pointer mx-2"
                    ></i>
                </Tooltip>
                {showVolumeSeekBar && (
                    <VolumeControls
                        isFullScreen={false}
                        updateVolume={updateVolume}
                        volume={volume}
                    />
                )}
            </div>
        </div>
    );
}

export default Buttons;
