import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { toggleModel } from "@/stores/player/currentAudioPlayer";
import { useState } from "react";
import {
    CreatePlaylistStatus,
    renamePlaylist,
} from "../stores/player/currentAudioPlayer";
import { useRouter } from "next/router";
import {
    addSongToPlaylist,
    createNewPlaylist,
} from "../stores/player/currentAudioPlayer";
import { toast } from "react-toastify";

function AddToPlaylistModel() {
    const { isModelOpen, playlists, passedDataToModel, createPlaylistStatus } =
        useSelector((state: any) => state.player);

    const { user } = useSelector((state: any) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const model = useRef(null);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [name, setname] = useState<string>("");
    useEffect(() => {
        if (!isModelOpen) return;

        if (passedDataToModel.playlist_name) {
            setname(passedDataToModel.playlist_name);
        }

        function handleClick(event: any) {
            // @ts-ignore-comment
            if (model.current && !model.current.contains(event.target)) {
                dispatch(toggleModel({ data: false, song_id: "" }));
            }
        }

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModelOpen]);

    useEffect(() => {
        if (
            createPlaylistStatus == CreatePlaylistStatus.done &&
            name.length !== 0
        ) {
            const playlist = playlists.find((e: any) => e.name == name);
            dispatch(toggleModel({ data: false, song_id: "" }));
            router.push(`/playlist/${playlist.id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createPlaylistStatus]);

    return (
        <div>
            {isModelOpen && (
                <div className="fixed inset-0 w-full h-full bg-black z-40 bg-opacity-50 flex items-center justify-center">
                    <div ref={model} className="w-80 rounded-md bg-[#1f1f1f]">
                        {passedDataToModel.song_id == "NEW" ? (
                            <div>
                                <p className="font-ProximaBold px-3 pt-4  text-gray-400">
                                    Chosse a name:
                                </p>
                                <div className="rounded-md p-2.5 flex item-center justify-center flex-row">
                                    <input
                                        type="search"
                                        placeholder="Playlist #1"
                                        onChange={(e) => {
                                            setname(e.target.value);
                                        }}
                                        className="w-full px-4 py-1.5 outline-0 border-none
                 text-white bg-[#4a4a4a] rounded-md"
                                    />
                                </div>
                                <div className="px-2.5 pb-5 pt-2 w-full ">
                                    <button
                                        disabled={
                                            name.length === 0 ||
                                            createPlaylistStatus ==
                                                CreatePlaylistStatus.waiting
                                        }
                                        onClick={() => {
                                            dispatch(
                                                createNewPlaylist({
                                                    token: user.token,
                                                    name: name,
                                                    song_id: undefined,
                                                })
                                            );
                                        }}
                                        className="bg-[#2bb540] disabled:bg-[#287b34] w-full p-1.5 rounded-lg text-center uppercase text-white font-ProximaBold"
                                    >
                                        <p>Create New</p>
                                    </button>
                                </div>
                            </div>
                        ) : passedDataToModel.song_id == "RENAME" ? (
                            <div>
                                <p className="font-ProximaBold px-3 pt-4  text-gray-400">
                                    Rename Playlist:
                                </p>
                                <div className="rounded-md p-2.5 flex item-center justify-center flex-row">
                                    <input
                                        type="search"
                                        placeholder="Playlist #1"
                                        value={name}
                                        onChange={(e) => {
                                            setname(e.target.value);
                                        }}
                                        className="w-full px-4 py-1.5 outline-0 border-none
                 text-white bg-[#4a4a4a] rounded-md"
                                    />
                                </div>
                                <div className="px-2.5 pb-5 pt-2 w-full ">
                                    <button
                                        disabled={name.length === 0}
                                        onClick={() => {
                                            dispatch(
                                                renamePlaylist({
                                                    token: user.token,
                                                    playlist_name: name,
                                                    playlist_id:
                                                        passedDataToModel.playlist_id,
                                                })
                                            );
                                            dispatch(
                                                toggleModel({
                                                    data: false,
                                                    song_id: "",
                                                })
                                            );
                                            toast.success("Playlist Renamed!");
                                        }}
                                        className="bg-[#2bb540] disabled:bg-[#287b34] w-full p-1.5 rounded-lg text-center uppercase text-white font-ProximaBold"
                                    >
                                        <p>Rename playlist</p>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="font-ProximaBold px-3 pt-3 pb-1.5 text-gray-400">
                                    Add to playlist:
                                </p>
                                <div className="rounded-md p-2.5 flex item-center justify-center flex-row">
                                    <div className="rounded-tl-md rounded-bl-md bg-[#4a4a4a] flex items-center px-2">
                                        <i className="icon-search text-white text-[20px] opacity-70"></i>
                                    </div>

                                    <input
                                        type="search"
                                        onChange={(e) => {
                                            if (e.target.value.length !== 0) {
                                                setShowResults(true);
                                                setResults(
                                                    playlists.filter(
                                                        (col: any) =>
                                                            col.name
                                                                .toLowerCase()
                                                                .match(
                                                                    e.target
                                                                        .value
                                                                )
                                                    )
                                                );
                                            } else {
                                                setShowResults(false);
                                            }
                                        }}
                                        placeholder="Find playlists.."
                                        className="w-full px-0 py-1.5 outline-0 border-none
                 text-white bg-[#4a4a4a] rounded-tr-md rounded-br-md"
                                    />
                                </div>
                                <div className="px-3">
                                    <div
                                        onClick={() => {
                                            dispatch(
                                                createNewPlaylist({
                                                    token: user.token,
                                                    name:
                                                        "Playlist #" +
                                                        passedDataToModel.song_id,
                                                    song_id:
                                                        passedDataToModel.song_id,
                                                })
                                            );
                                            dispatch(
                                                toggleModel({
                                                    data: false,
                                                    song_id: "",
                                                })
                                            );
                                            toast.success(
                                                "Created new playlist!"
                                            );
                                        }}
                                        className="font-ProximaBold cursor-pointer hover:bg-[#464646] px-2 py-2 text-white rounded"
                                    >
                                        <p> Create playlist</p>
                                    </div>

                                    <div className="border-b border-slate-700 py-1"></div>
                                    <div className="h-[400px] overflow-y-scroll scroll scrollbar">
                                        {!showResults ? (
                                            <div>
                                                {playlists.map((e: any) => (
                                                    <div
                                                        className="font-ProximaRegular tracking-wide text-[15px] hover:bg-[#4a4a4a] px-2 py-2 text-slate-200 rounded cursor-pointer"
                                                        key={e.id}
                                                        onClick={() => {
                                                            dispatch(
                                                                addSongToPlaylist(
                                                                    {
                                                                        token: user.token,
                                                                        playlist_id:
                                                                            e.id,
                                                                        song_id:
                                                                            passedDataToModel.song_id,
                                                                    }
                                                                )
                                                            );
                                                            dispatch(
                                                                toggleModel({
                                                                    data: false,
                                                                    song_id: "",
                                                                })
                                                            );
                                                            toast.success(
                                                                "Added to playlist!"
                                                            );
                                                        }}
                                                    >
                                                        {e.name}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                {results.map((e: any) => (
                                                    <div
                                                        className="font-ProximaRegular tracking-wide text-[15px] hover:bg-[#4a4a4a] px-2 py-2 text-slate-200 rounded cursor-pointer"
                                                        key={e.id}
                                                        onClick={() => {
                                                            dispatch(
                                                                addSongToPlaylist(
                                                                    {
                                                                        token: user.token,
                                                                        playlist_id:
                                                                            e.id,
                                                                        song_id:
                                                                            passedDataToModel.song_id,
                                                                    }
                                                                )
                                                            );
                                                            dispatch(
                                                                toggleModel({
                                                                    data: false,
                                                                    song_id: "",
                                                                })
                                                            );
                                                            toast.success(
                                                                "Added to playlist!"
                                                            );
                                                        }}
                                                    >
                                                        {e.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddToPlaylistModel;
