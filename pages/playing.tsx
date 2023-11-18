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
} from "@/stores/player/currentAudioPlayer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FullScreenPlayer from "@/components/AudioPlayer/FullScreenPlayer";
import { getPlaylists } from "@/stores/player/currentAudioPlayer";

function Playing() {
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

export default Playing;
