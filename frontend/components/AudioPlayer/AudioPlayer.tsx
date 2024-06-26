import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    IStateProps,
    nextSong,
    onRepeat,
    onShuffle,
    playPause,
    setVolume,
} from "@/stores/player/currentAudioPlayer";
import Controls from "./Controls";
import SeekBar from "./SeekBar";
import Buttons from "./Buttons";
import {
    Image,
    Link,
} from "@nextui-org/react";
import { API } from "@/config/api";
import { Artist } from "@/interfaces/artist";
import useSWR from "swr";
import axios from "axios";
import PlayingModal from "@/components/Playing";

function AudioPlayer({ isHidden }: { isHidden?: boolean }) {
    const {
        isPlaying,
        activeSong,
        currentIndex,
        volume,
        queue: songs,
        isShuffle,
        isRepeat,
    }: IStateProps = useSelector((state: any) => state.player);

    const dispatch = useDispatch<any>();

    const { data: artists } = useSWR<Artist[], Error>(
        activeSong?.id
            ? API.songArtists({ songID: activeSong?.id })
            : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data.list;
        }
    );

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

    const updateVolume = (e: any) => {
        dispatch(setVolume(e));
    };

    const [isOpenPlayingModal, setOpenPlayingModal] = useState(false);

    if (!activeSong) {
        return;
    }


    return (
        <>
            <PlayingModal isOpen={isOpenPlayingModal} handleClose={() => setOpenPlayingModal(false)} />

            <div
                className={` 
      fixed bottom-0 left-0 right-0 py-3 px-4 pb-4
     border-t-[#242424] border-t
     mobile:py-1 mobile:px-2 z-20
     mobile:bottom-12 tablet:bottom-12
      bg-[#121212]/70 backdrop-blur-xl 
      ${isHidden ? "invisible" : "visible"}`}
            >
                <div
                    className="flex flex-row 
      items-center justify-between 
      w-screen max-w-full mini-laptop:px-2 mobile:p-2 mobile:pb-0 "
                >
                    <div className="flex flex-row items-center w-full cursor-pointer"
                        onClick={() => setOpenPlayingModal(!isOpenPlayingModal)}
                    >
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

                            <p>
                                {artists &&
                                    artists.map((artist: Artist, index: number) => (
                                        <>
                                            <Link
                                                href={`/artist/${artist.id}`}
                                                className="text-gray-300 text-sm"
                                            >
                                                {artist.name}
                                            </Link>
                                            {index < artists.length - 1 && ", "}
                                        </>
                                    ))}
                            </p>
                        </div>
                    </div>
                    <div className="w-full">
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

                        <SeekBar className="tablet:hidden mobile:hidden" />
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
        </>
    );
}

export default AudioPlayer;
