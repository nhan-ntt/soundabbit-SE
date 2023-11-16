/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    PlaylistsStatus,
    getLikedSongs,
    IStateProps,
    LikedStatus,
    nextSong,
    onRepeat,
    onShuffle,
    playPause,
    setSongProgress,
} from "../../stores/player/currentAudioPlayer";
import { useEffect } from "react";
import Controls from "./Controls";
import SeekBar from "./SeekBar";
import Buttons from "./Buttons";
import { useRouter } from "next/router";
import FullScreenPlayer from "./FullScreenPlayer";
import CustomImage from "../CustomImage";
import { getPlaylists } from "../../stores/player/currentAudioPlayer";

function AudioPlayer({ className }: { className: string }) {
    const router = useRouter();
    const { user, status } = useSelector((state: any) => state.auth);
    const {
        isPlaying,
        activeSong,
        currentIndex,
        songProgress,
        fetchlikedStatus,
        playlistStatus,
        queue: songs,
        isShuffle,
        isRepeat,
    }: IStateProps = useSelector((state: any) => state.player);

    let activeSongDemo = JSON.parse(JSON.stringify(activeSong));
    activeSongDemo.artist_name = "png";
    activeSongDemo.artist_id = 1;
    activeSongDemo.cover_image = {
        color: "black",
        url: "https://images3.alphacoders.com/690/690494.jpg",
    };

    const dispatch = useDispatch<any>();
    const audioRef = useRef(
        typeof Audio !== "undefined"
            ? new Audio(activeSongDemo!.audio_link)
            : null
    );
    const isReady = useRef(false);
    const [volume, setVolume] = useState(1);
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
    const [seekBarColor, setSeekBarColor] = useState("#fff");
    const changeSeekBarColor = (color: string) => setSeekBarColor(color);

    useEffect(() => {
        if (isPlaying) {
            if (audioRef.current) audioRef.current!.play();
            startTimer();
        } else {
            audioRef.current!.pause();
        }
    }, [isPlaying]);

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

    useEffect(() => {
        audioRef.current!.loop = isRepeat;
    }, [isRepeat]);

    useEffect(() => {
        audioRef.current!.pause();

        audioRef.current = new Audio(activeSong!.audio_link);
        dispatch(setSongProgress(audioRef.current.currentTime));
        audioRef.current.volume = volume;

        if (isReady.current) {
            audioRef.current.play();
            dispatch(playPause(true));
            startTimer();
        } else {
            isReady.current = true;
        }
    }, [activeSong, currentIndex]);

    const onScrub = (value: any) => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        audioRef.current!.currentTime = value;
        dispatch(setSongProgress(audioRef.current!.currentTime));
    };

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current!.ended) {
                toNextSong();
            } else {
                dispatch(setSongProgress(audioRef.current!.currentTime));
            }
        }, 1000);
    };

    const onScrubEnd = () => {
        // If not already playing, start
        if (!isPlaying) {
            dispatch(playPause(true));
        }
        startTimer();
    };

    useEffect(() => {
        if (fetchlikedStatus == LikedStatus.Initial) {
            if (user) {
                dispatch(getLikedSongs(user));
            }
        } // Pause and clean up on unmount
        if (playlistStatus == PlaylistsStatus.Initial) {
            if (user) {
                dispatch(getPlaylists(user.token));
            }
        }
        return () => {
            audioRef.current!.pause();
            clearInterval(intervalRef.current);
        };
    }, []);

    // get formated time in 0:00

    // update volume function
    const updateVolume = (e: any) => {
        setVolume(e);
        audioRef.current!.volume = e;
    };
    const getDuration = () => {
        return audioRef.current?.duration || 0;
    };

    const currentPercentage = () => {
        return getDuration()
            ? `${(songProgress / getDuration()) * 100}%`
            : "0%";
    };

    const songStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage()}, ${seekBarColor}), color-stop(${currentPercentage()}, #777))
  `;

    if (router.pathname === "/playing") {
        return (
            <FullScreenPlayer
                changeSeekBarColor={changeSeekBarColor}
                isShuffle={isShuffle}
                isRepeat={isRepeat}
                isPlaying={isPlaying}
                toNextSong={toNextSong}
                toPrevSong={toPrevSong}
                songProgress={songProgress}
                songBarStyling={songStyling}
                audioRef={audioRef}
                activeSong={activeSongDemo!}
                onScrubEnd={onScrubEnd}
                onScrub={onScrub}
                updateVolume={updateVolume}
                volume={volume}
                songStyling={songStyling}
            />
        );
    }

    return (
        <div
            onClick={() => router.push("/playing")}
            className={`font-ProximaRegular 
      fixed bottom-0 left-0 right-0 py-3 px-4 pb-4
     border-t-[#242424] border-t
     mobile:py-1 mobile:px-2 z-20
     mobile:bottom-12 tablet:bottom-12
      bg-[#121212] 
      select-none ${className}`}
        >
            <div
                className="flex flex-row 
      items-center justify-between 
      w-screen max-w-full mini-laptop:px-2 mobile:p-2 mobile:pb-0 "
            >
                <div className="flex flex-row items-center w-full cursor-pointer">
                    <div
                        style={{
                            backgroundColor: activeSongDemo!.cover_image.color,
                            boxShadow:
                                "rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset",
                        }}
                        className="w-[50px] h-[50px] min-w-[50px]
         relative mini-laptop:w-[40px] mini-laptop:h-[40px]
          mini-laptop:min-w-[40px] mobile:min-w-[35px] mobile:w-[35px]
           mobile:h-[35px] cursor-pointer rounded-sm"
                    >
                        <CustomImage
                            src={
                                activeSongDemo!.cover_image.url +
                                "&auto=format&fit=crop&w=400&q=50&h=400"
                            }
                            className="rounded-sm w-[50px] h-[50px]"
                        />
                    </div>

                    <div className="mx-4 mobile:mx-3">
                        <p
                            className="text-gray-300 
          cursor-pointer line-clamp-1 mobile:text-sm"
                        >
                            {activeSongDemo!.name}
                        </p>

                        <p
                            className="text-gray-400 text-sm mobile:text-xs 
            hover:underline cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                    `/artist/${activeSongDemo?.artist_id}`
                                );
                            }}
                        >
                            {activeSongDemo!.artist_name}
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
                        audioRef={audioRef}
                        isFullScreen={false}
                        onScrubEnd={onScrubEnd}
                        onScrub={onScrub}
                    />
                </div>
                <Buttons
                    download_url={activeSongDemo!.audio_link}
                    song_id={activeSongDemo!.id}
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
