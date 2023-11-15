import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    addToQueue,
    removeFromQueue,
    toggleModel,
} from "../stores/player/currentAudioPlayer";
import LikeButton from "./AudioPlayer/LikeButton";
import CustomImage from "./CustomImage";
import { removeSongFromPlaylist } from "../stores/player/currentAudioPlayer";
import { toast } from "react-toastify";

function ListItem({ song, showNumber, onTap, isScrolling, playlist }: any) {
    const { activeSong, songs } = useSelector((state: any) => state.player);
    const { user } = useSelector((state: any) => state.auth);
    const dropdown = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch<any>();
    const getTime = (time: any) =>
        `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;

    let songDemo = JSON.parse(JSON.stringify(song));
    songDemo.artist_name = "png";
    songDemo.artist_id = 1;
    songDemo.duration = 1000;
    songDemo.cover_image = {
        color: "black",
        url: "https://images3.alphacoders.com/690/690494.jpg",
    };

    useEffect(() => {
        if (!showDropdown) return;
        function handleClick(event: any) {
            // @ts-ignore-comment
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [showDropdown]);

    useEffect(() => {
        if (isScrolling) setShowDropdown(false);
    }, [isScrolling]);

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                if (!showDropdown) {
                    onTap();
                }
                setShowDropdown(false);
            }}
            className="relative"
        >
            <div
                className={`cursor-default hover:bg-[#5f5d5d60] flex flex-row justify-between 
              items-center py-2 w-full rounded-md group mobile:hover:bg-transparent tablet:hover:bg-transparent 
              ${showDropdown && "bg-[#5f5d5d60]"}`}
            >
                <div className="flex-grow flex flex-row items-center">
                    {showNumber && (
                        <p className="mx-2 ml-4 mobile:ml-0 tablet:ml-0 text-slate-300">
                            {showNumber}
                        </p>
                    )}
                    <div>
                        <div
                            className="relative w-12 h-12 min-w-12 mx-2 mobile:w-10 mobile:h-10"
                            style={{
                                backgroundColor: songDemo.cover_image.color,
                            }}
                        >
                            <CustomImage
                                src={
                                    songDemo.cover_image.url +
                                    "&auto=format&fit=crop&w=400&q=50&h=400"
                                }
                                className="w-12 min-w-12"
                            />
                        </div>
                    </div>

                    <div className="">
                        <p
                            className={`mobile:text-sm line-clamp-1 ${
                                activeSong.id == song.id &&
                                "text-[#2bb540] font-ProximaBold"
                            }`}
                            dangerouslySetInnerHTML={{ __html: songDemo.name }}
                        ></p>
                        <p className="text-sm mobile:text-xs text-gray-300">
                            {songDemo.artist_name}
                        </p>
                    </div>
                </div>
                <div className="ml-2 flex flex-row items-center">
                    <div className="group-hover:visible invisible mobile:visible tablet:visible ">
                        <LikeButton song_id={song.id} isList={true} />
                    </div>

                    <p className="text-gray-300 text-sm w-[25px] text-right ml-3 mobile:hidden">
                        {getTime(songDemo.duration)}
                    </p>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(!showDropdown);
                        }}
                    >
                        <i
                            className="cursor-pointer group-hover:visible invisible mobile:visible relative
         tablet:visible icon-more-horizontal text-[20px] ml-3 text-gray-200 mr-2.5"
                        ></i>
                    </div>
                </div>
                {showDropdown && (
                    <div
                        ref={dropdown}
                        className="w-fit bg-[#212121] absolute  rounded shadow 
             right-2 top-10 z-30"
                    >
                        <div
                            onClick={() => {
                                setShowDropdown(false);
                                if (!songs.includes(songDemo)) {
                                    dispatch(addToQueue(songDemo));
                                } else {
                                    dispatch(
                                        removeFromQueue(songs.indexOf(song))
                                    );
                                }
                            }}
                            className="cursor-pointer px-4 rounded py-1.5 hover:bg-[#323232] border-b border-b-[#3e3e3e]"
                        >
                            {!songs.includes(song)
                                ? "Add to Queue"
                                : "Remove from Queue"}
                        </div>
                        <div
                            onClick={() => {
                                setShowDropdown(false);
                                dispatch(addToQueue(songDemo));
                            }}
                            className="cursor-pointer  px-4 rounded py-1.5 hover:bg-[#323232] border-b border-b-[#3e3e3e]"
                        >
                            Play Next
                        </div>
                        {playlist ? (
                            <div
                                className="cursor-pointer  rounded px-4 py-1.5 hover:bg-[#323232]"
                                onClick={() => {
                                    dispatch(
                                        removeSongFromPlaylist({
                                            token: user.token,
                                            playlist_id: playlist,
                                            song_id: song.id,
                                        })
                                    );
                                    toast.success("Removed from playlist!");
                                }}
                            >
                                Remove from Playlist
                            </div>
                        ) : (
                            <div
                                className="cursor-pointer  rounded px-4 py-1.5 hover:bg-[#323232]"
                                onClick={() =>
                                    dispatch(
                                        toggleModel({
                                            data: true,
                                            song_id: song.id,
                                        })
                                    )
                                }
                            >
                                Add to Playlist
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListItem;
