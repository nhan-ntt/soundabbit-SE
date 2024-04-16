import { useSelector, useDispatch } from "react-redux";
import {
    addToQueue,
    removeFromQueue,
    toggleModal,
} from "@/stores/player/currentAudioPlayer";
import LikeButton from "./AudioPlayer/LikeButton";
import { removeSongFromPlaylist } from "@/stores/player/currentAudioPlayer";
import { toast } from "react-toastify";
import { Song } from "@/interfaces/song";
import { Playlist } from "@/interfaces/playlist";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Link,
} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import API_URL from "@/config/apiUrl";
import useSWR from "swr";
import { Artist } from "@/interfaces/artist";
import axios from "axios";
import { useSession } from "next-auth/react";

function ListItem({
    song,
    showNumber,
    onTap,
    playlist,
    queueAction = true,
}: {
    song: Song;
    showNumber?: number;
    onTap: any;
    playlist?: Playlist;
    queueAction?: boolean;
}) {
    const { activeSong, queue } = useSelector((state: any) => state.player);
    const { data: session, status } = useSession();
    const dispatch = useDispatch<any>();

    const { data: artists } = useSWR<Artist[], Error>(
        song && song.id ? `${API_URL}/songs/${song.id}/artists` : null,
        async (url: string) => {
            const res = await axios.get(url);
            return res.data.list;
        }
    );

    if (!song || !showNumber) {
        return;
    }

    return (
        <div className="relative" onClick={onTap}>
            <div
                className={`cursor-default hover:bg-[#5f5d5d60] flex flex-row justify-between 
              items-center py-2 w-full rounded group mobile:hover:bg-transparent tablet:hover:bg-transparent`}
            >
                <div className="flex-grow flex flex-row items-center">
                    {showNumber && (
                        <p className="mx-2 ml-4 mobile:ml-0 tablet:ml-0 text-slate-300">
                            {showNumber}
                        </p>
                    )}
                    <div>
                        <div className="relative w-12 h-12 min-w-12 mx-2 mobile:w-10 mobile:h-10">
                            <Image
                                alt=""
                                src={song.image_link}
                                className="w-12 h-12 min-w-12 mobile:w-10 mobile:h-10 rounded object-cover"
                            />
                        </div>
                    </div>

                    <div className="">
                        <p
                            className={`mobile:text-sm line-clamp-1 ${activeSong?.id == song.id && "text-[#2bb540] "
                                }`}
                            dangerouslySetInnerHTML={{ __html: song.name }}
                        ></p>
                        <p className="text-sm mobile:text-xs">
                            {artists &&
                                artists.map((artist: Artist, index: number) => (
                                    <>
                                        <Link
                                            href={`/artist/${artist.id}`}
                                            className="text-gray-300"
                                        >
                                            {artist.name}
                                        </Link>
                                        {(index < artists.length - 1) && ', '}
                                    </>
                                ))}
                        </p>
                    </div>
                </div>

                <LikeButton song_id={song.id} isList={true} />

                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <i
                            className="cursor-pointer group-hover:visible invisible mobile:visible relative
         tablet:visible icon-more-horizontal text-[20px] ml-3 text-gray-200 mr-2.5"
                        ></i>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem
                            hidden={!queueAction}
                            onClick={() => {
                                if (!queue.includes(song)) {
                                    dispatch(addToQueue(song));
                                } else {
                                    dispatch(
                                        removeFromQueue(queue.indexOf(song))
                                    );
                                }
                            }}
                        >
                            {queue.includes(song)
                                ? "Remove from Queue"
                                : "Add to Queue"}
                        </DropdownItem>

                        <DropdownItem
                            onClick={() => {
                                dispatch(addToQueue(song));
                            }}
                        >
                            Play Next
                        </DropdownItem>
                        {playlist ? (
                            <DropdownItem
                                onClick={() => {
                                    dispatch(
                                        removeSongFromPlaylist({
                                            token: session?.user.token,
                                            playlist_id: playlist,
                                            song_id: song.id,
                                        })
                                    );
                                    toast.success("Removed from playlist!");
                                }}
                            >
                                Remove from Playlist
                            </DropdownItem>
                        ) : (
                            <DropdownItem
                                onClick={() =>
                                    dispatch(
                                        toggleModal({
                                            data: true,
                                            song_id: song.id,
                                        })
                                    )
                                }
                            >
                                Add to Playlist
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}

export default ListItem;
