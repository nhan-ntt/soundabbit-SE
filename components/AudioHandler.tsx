import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    PlaylistsStatus,
    getLikedSongs,
    IStateProps,
    LikedStatus,
    nextSong,
    playPause,
    setSongProgress,
    setDuration,
} from "@/stores/player/currentAudioPlayer";
import { useEffect } from "react";
import { getPlaylists } from "@/stores/player/currentAudioPlayer";

function AudioHandler() {
    const { user } = useSelector((state: any) => state.auth);
    const {
        isPlaying,
        activeSong,
        currentIndex,
        currentTime,
        volume,
        fetchlikedStatus,
        playlistStatus,
        queue: songs,
        isShuffle,
        isRepeat,
    }: IStateProps = useSelector((state: any) => state.player);

    const dispatch = useDispatch<any>();
    const audioRef = useRef(
        typeof Audio !== "undefined"
            ? new Audio(activeSong!.audio_link)
            : null
    );
    const isReady = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

    useEffect(() => {
        if (isPlaying) {
            if (audioRef.current) audioRef.current!.play();
            startTimer();
        } else {
            audioRef.current!.pause();
            clearInterval(intervalRef.current);
        }
    }, [isPlaying]);

    const toNextSong = () => {
        if (isShuffle) {
            dispatch(nextSong(Math.floor(Math.random() * songs.length)));
        } else if (songs.length - 1 !== currentIndex) {
            dispatch(nextSong(currentIndex + 1));
        }
    };

    useEffect(() => {
        audioRef.current!.loop = isRepeat;
    }, [isRepeat]);

    useEffect(() => {
        audioRef.current!.currentTime = currentTime;
    }, [currentTime]);

    useEffect(() => {
        audioRef.current!.volume = volume;
    }, [volume]);

    useEffect(() => {
        audioRef.current!.pause();

        audioRef.current = new Audio(activeSong!.audio_link);
        dispatch(setSongProgress(audioRef.current.currentTime));

        if (isReady.current) {
            audioRef.current.play();
            dispatch(playPause(true));
            startTimer();
        } else {
            isReady.current = true;
        }
    }, [activeSong, currentIndex]);

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current!.ended) {
                toNextSong();
            } else {
                dispatch(setSongProgress(audioRef.current!.currentTime));
                dispatch(setDuration(audioRef.current!.duration || 0));
            }
        }, 1000);
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

    return <></>;
}

export default AudioHandler;
