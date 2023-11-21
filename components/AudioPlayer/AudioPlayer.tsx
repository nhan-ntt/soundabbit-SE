/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    IStateProps,
    nextSong,
    onRepeat,
    onShuffle,
    playPause,
    setSongProgress,
    setVolume,
    setCurrentTime,
} from "@/stores/player/currentAudioPlayer";
import Controls from "./Controls";
import SeekBar from "./SeekBar";
import Buttons from "./Buttons";
import { useRouter } from "next/navigation";
import { Image } from "@nextui-org/react";

function AudioPlayer({ isHidden }: { isHidden?: boolean }) {
    const router = useRouter();
    const {
        isPlaying,
        activeSong,
        currentIndex,
        songProgress,
        volume,
        duration,
        queue: songs,
        isShuffle,
        isRepeat,
    }: IStateProps = useSelector((state: any) => state.player);

    const dispatch = useDispatch<any>();
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
    const [seekBarColor, setSeekBarColor] = useState("#fff");
    const changeSeekBarColor = (color: string) => setSeekBarColor(color);

    const toNextSong = () => {
        if (isShuffle) {
            dispatch(nextSong(Math.floor(Math.random() * songs.length)));
        } else if (songs.length - 1 !== currentIndex) {
            dispatch(nextSong(currentIndex + 1));
        }
    };
    const toPrevSong = () => {
        if (isShuffle) {
            dispatch(nextSong(Math.floor(Math.random() * songs.length)));
        } else if (currentIndex !== 0) {
            dispatch(nextSong(currentIndex - 1));
        }
    };

    const onScrub = (value: any) => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        dispatch(setCurrentTime(value));
        dispatch(setSongProgress(value));
    };

    const onScrubEnd = () => {
        // If not already playing, start
        if (!isPlaying) {
            dispatch(playPause(true));
        }
    };
    // get formated time in 0:00

    // update volume function
    const updateVolume = (e: any) => {
        dispatch(setVolume(e));
    };

    const currentPercentage = () => {
        return duration ? `${(songProgress / duration) * 100}%` : "0%";
    };

    const songStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage()}, ${seekBarColor}), color-stop(${currentPercentage()}, #777))
  `;

    return (
        <div
            onClick={() => router.push("/playing")}
            className={`font-ProximaRegular 
      fixed bottom-0 left-0 right-0 py-3 px-4 pb-4
     border-t-[#242424] border-t
     mobile:py-1 mobile:px-2 z-20
     mobile:bottom-12 tablet:bottom-12
      bg-[#121212] 
      select-none ${isHidden ? "invisible" : "visible"}`}
        >
            <div
                className="flex flex-row 
      items-center justify-between 
      w-screen max-w-full mini-laptop:px-2 mobile:p-2 mobile:pb-0 "
            >
                <div className="flex flex-row items-center w-full cursor-pointer">
                    <div
                        className="w-[50px] h-[50px] min-w-[50px]
         relative mini-laptop:w-[40px] mini-laptop:h-[40px]
          mini-laptop:min-w-[40px] mobile:min-w-[35px] mobile:w-[35px]
           mobile:h-[35px] cursor-pointer rounded"
                    >
                        <Image
                            className="object-cover w-[50px] h-[50px] min-w-[50px]
         relative mini-laptop:w-[40px] mini-laptop:h-[40px]
          mini-laptop:min-w-[40px] mobile:min-w-[35px] mobile:w-[35px]
           mobile:h-[35px] cursor-pointer rounded"
                            alt=""
                            src={activeSong!.image_link}
                        />
                    </div>

                    <div className="mx-4 mobile:mx-3">
                        <p
                            className="text-gray-300 
          cursor-pointer line-clamp-1 mobile:text-sm"
                        >
                            {activeSong!.name}
                        </p>

                        <p
                            className="text-gray-400 text-sm mobile:text-xs 
            hover:underline cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                // router.push(`/artist/${activeSong?.artist_id}`);
                            }}
                        >
                            artist name
                        </p>
                    </div>
                </div>
                <div>
                    <Controls
                        isFullScreen={false}
                        isShuffle={isShuffle}
                        isRepeat={isRepeat}
                        onRepeat={() => dispatch(onRepeat(!isRepeat))}
                        onShuffle={() => dispatch(onShuffle(!isShuffle))}
                        playPause={() => dispatch(playPause(!isPlaying))}
                        isPlaying={isPlaying}
                        nextSong={toNextSong}
                        prevSong={toPrevSong}
                    />
                    <SeekBar
                        changeSeekBarColor={changeSeekBarColor}
                        songProgress={songProgress}
                        songBarStyling={songStyling}
                        duration={duration}
                        isFullScreen={false}
                        onScrubEnd={onScrubEnd}
                        onScrub={onScrub}
                    />
                </div>
                <Buttons
                    download_url={activeSong!.audio_link}
                    song_id={activeSong!.id}
                    updateVolume={updateVolume}
                    showVolumeSeekBar
                    volume={volume}
                    className="tablet:hidden mobile:hidden"
                />
            </div>
        </div>
    );
}

export default AudioPlayer;
