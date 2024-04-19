import React, { useRef } from "react";
import { Howl, Howler } from "howler";
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
import { useSession } from "next-auth/react";

function AudioHandler() {
    const { data: session, status } = useSession();
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
    const audioRef = useRef<Howl | null>(null);
    const isReady = useRef(false);
    const requestRef = useRef<number | null>(null);

    const animate = () => {
        if (audioRef.current) {
            dispatch(setSongProgress(audioRef.current.seek()));
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    const handlePlay = () => {
        requestRef.current = requestAnimationFrame(animate);
    };

    const handlePause = () => {
        cancelAnimationFrame(requestRef.current!);
    };

    useEffect(() => {
        if (isPlaying) {
            if (audioRef.current) {
                audioRef.current.play();
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }

        return () => cancelAnimationFrame(requestRef.current!);
    }, [isPlaying]);

    const toNextSong = () => {
        if (isShuffle) {
            dispatch(nextSong(Math.floor(Math.random() * songs.length)));
        } else if (songs.length - 1 !== currentIndex) {
            dispatch(nextSong(currentIndex + 1));
        }
    };

    const handleLoad = () => {
        if (audioRef.current) {
            dispatch(setDuration(audioRef.current.duration()));
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop(isRepeat);
        }
    }, [isRepeat]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.seek(currentTime);
        }
    }, [currentTime]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume(volume);
        }
    }, [volume]);

    useEffect(() => {
        if (!activeSong) {
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        audioRef.current = new Howl({
            src: [activeSong!.audio_link],
            html5: true,
            onend: toNextSong,
            onload: handleLoad,
            onplay: handlePlay,
            onpause: handlePause,
        });

        if (isReady.current) {
            audioRef.current.play();
            dispatch(playPause(true));
        } else {
            isReady.current = true;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            cancelAnimationFrame(requestRef.current!);
        };
    }, [activeSong, currentIndex]);

    useEffect(() => {
        dispatch(playPause(false));

        if (session && fetchlikedStatus === LikedStatus.Initial) {
            dispatch(getLikedSongs(session?.user));
        }

        if (session && playlistStatus === PlaylistsStatus.Initial) {
            dispatch(getPlaylists(session?.user.token || " "));
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            cancelAnimationFrame(requestRef.current!);
        };
    }, []);

    return <></>;
}

export default AudioHandler;
