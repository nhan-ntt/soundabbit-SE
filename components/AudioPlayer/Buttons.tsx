import React from "react";
import LikeButton from "./LikeButton";
import VolumeControls from "./VolumeControls";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tooltip } from "@nextui-org/react";
interface IProps {
    volume: number;
    updateVolume: (e: any) => void;
    className: string;
    showVolumeSeekBar: boolean;
    song_id: number;
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
    return (
        <div
            className={
                `w-full flex flex-row justify-end items-center
       ` + className
            }
        >
            <div
                className="flex flex-row items-center"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <LikeButton song_id={song_id} />

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
