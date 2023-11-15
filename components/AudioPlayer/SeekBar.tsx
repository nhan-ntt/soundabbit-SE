import React from "react";
import { SongProps } from "@/interfaces/Song";

interface IProps {
    songProgress: number;
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    activeSong: SongProps;
    onScrubEnd: () => void;
    onScrub: (e: any) => void;
    songBarStyling: any;
    isFullScreen: boolean;
    changeSeekBarColor: (e: string) => void;
}
function SeekBar({
    songProgress: songProgress,
    audioRef,
    activeSong,
    onScrubEnd,
    onScrub,
    songBarStyling: songBarStyling,
    isFullScreen,
    changeSeekBarColor,
}: IProps) {
    const getTime = (time: any) =>
        `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;
    if (isFullScreen) {
        return (
            <div
                className="flex flex-row justify-center items-center 
         tablet:w-[400px]
         mobile:w-[320px]
       text-gray-300 text-xs"
            >
                <p className="w-6">
                    {audioRef.current ? getTime(songProgress) : "0:00"}
                </p>

                <input
                    type="range"
                    value={songProgress}
                    step="1"
                    min="0"
                    onMouseEnter={() => changeSeekBarColor("#2bb540")}
                    onMouseLeave={() => changeSeekBarColor("#fff")}
                    style={{ background: songBarStyling }}
                    max={activeSong!.duration}
                    onMouseUp={onScrubEnd}
                    onKeyUp={onScrubEnd}
                    className="max-h-1 cursor-pointer w-[24rem] mx-2 laptop:w-[18rem]
          mini-laptop:w-[16rem] 
          "
                    onChange={(e) => onScrub(e.target.value)}
                />
                <p className="w-6">{getTime(activeSong!.duration)}</p>
            </div>
        );
    }
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
            }}
            className="flex flex-row justify-center items-center 
          tablet:justify-end
       text-gray-300 text-xs mobile:hidden tablet:hidden"
        >
            <p className="w-6">
                {audioRef.current ? getTime(songProgress) : "0:00"}
            </p>

            <input
                type="range"
                value={songProgress}
                step="1"
                min="0"
                style={{ background: songBarStyling }}
                max={activeSong!.duration}
                onMouseUp={onScrubEnd}
                onKeyUp={onScrubEnd}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className="max-h-1 cursor-pointer w-[26rem] laptop:w-[20rem]
             bg-gray-600 mx-2 mini-laptop:w-[16rem] tablet:w-[16rem]"
                onChange={(e) => {
                    e.stopPropagation();
                    onScrub(e.target.value);
                }}
            />
            <p className="w-6">{getTime(activeSong!.duration)}</p>
        </div>
    );
}

export default SeekBar;
