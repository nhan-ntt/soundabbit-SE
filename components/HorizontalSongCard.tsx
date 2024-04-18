import React from "react";
import { playPause } from "@/stores/player/currentAudioPlayer";
import { Song } from "@/interfaces/song";
import { useDispatch, useSelector } from "react-redux";
import { Image, Link } from "@nextui-org/react";
import { Artist } from "@/interfaces/artist";
import useSWR from "swr";
import axios from "axios";
import API_URL from "@/config/apiUrl";
import classNames from "classnames";

function HorizontalSongCard({
    song,
    onClick,
}: {
    song: Song;
    onClick: () => void;
}) {
    const { activeSong, isPlaying } = useSelector((state: any) => state.player);

    const { data: artists, error: errorGetSongs } = useSWR<Artist[], Error>(
        song && song.id ? `${API_URL}/songs/${song.id}/artists` : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data.list;
        }
    );

    return (
        <div
            className="mr-4 cursor-grab group"
            onClick={onClick}
        >
            <div
                className="transition-all duration-100 p-4 bg-gradient-to-t from-[#2c2a2a4a] to-[#2c2a2ac7] hover:bg-[#4340409d]
           tablet:hover:bg-transparent mobile:hover:bg-transparent
           rounded h-full mini-laptop:p-3 tablet:p-0 tablet:from-transparent tablet:to-transparent
           mobile:from-transparent mobile:to-transparent mobile:p-0
           "
            >
                <div
                    className="
                    w-[200px] h-[200px] relative 
          mini-laptop:w-[140px] mini-laptop:h-[140px] 
          tablet:w-[130px] tablet:h-[130px] mobile:w-[100px] mobile:h-[100px]"
                >
                    <PlayPauseButton
                        isHover
                        isPlaying={(activeSong?.id === song.id) && isPlaying}
                        className={classNames("transition-all duration-75 opacity-0	group-hover:opacity-100", { ["opacity-100"]: (activeSong?.id === song.id) })}
                    />

                    <Image
                        src={song.image_link}
                        alt="song cover image"
                        width={200}
                        height={200}
                        className="z-6 w-[200px] h-[200px] relative 
          mini-laptop:w-[140px] mini-laptop:h-[140px] 
          tablet:w-[130px] tablet:h-[130px] rounded mobile:w-[100px] mobile:h-[100px] object-cover"
                    />
                </div>

                <div
                    className="
                w-[200px] relative 
                mini-laptop:w-[140px] 
                tablet:w-[130px] rounded mobile:w-[100px] 
                "
                >
                    <p className="truncate mt-3 text-base mobile:text-sm tablet:text-sm">
                        {song.name}
                    </p>
                </div>
                <p
                    className="line-clamp-2 mt-0.5 text-sm text-gray-400 
             mobile:text-xs tablet:text-xs"
                >
                    {artists &&
                        artists.map((artist: Artist, index: number) => (
                            <>
                                <Link
                                    key={artist.id}
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
    );
}

export function PlayPauseButton({
    isPlaying,
    className
}: {
    isPlaying: boolean;
    isHover?: boolean;
    className?: string;
}) {
    const dispatch = useDispatch();

    return (
        <div>
            <div className={classNames("absolute w-full h-full bg-black bg-opacity-10 z-10 flex justify-end items-end rounded", className)}>
                <div
                    onClick={() => dispatch(playPause(!isPlaying))}
                    className="transition-all duration-75 mx-2 my-3 bg-[#2bb540] rounded-full cursor-pointer hover:scale-110
                     w-[45px] h-[45px] flex justify-center items-center mobile:w-[30px] mobile:h-[30px] shadow-xl"
                >
                    {isPlaying ? (
                        <i className="icon-pause text-[20px] text-black mobile:text-[16px]" />
                    ) : (
                        <i className="icon-play text-[20px] ml-1 text-black mobile:text-[16px]" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default HorizontalSongCard;
