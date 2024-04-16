import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unLike } from "@/stores/player/currentAudioPlayer";
import {
    addLike,
    removeLike,
    Like,
} from "@/stores/player/currentAudioPlayer";
import { Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";

function LikeButton({ song_id, size, isList }: any) {
    const [like, setLike] = useState(false);
    const dispatch = useDispatch<any>();
    const { liked } = useSelector((state: any) => state.player);
    const { data: session, status } = useSession();

    useEffect(() => {
        setLike(liked.includes(song_id));
    }, [song_id, liked, like]);

    return (
        <div
            className={
                isList &&
                (like
                    ? "visible"
                    : "invisible group-hover:visible mobile:visible tablet:visible")
            }
        >
            {!like ? (
                <Tooltip content="Like">
                    <i
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(addLike({ user: session?.user, song_id }));
                            setLike(true);
                            dispatch(Like({ user: session?.user, song_id }));
                        }}
                        className={`cursor-pointer icon-Like text-gray-400 
          ${size ? size : "text-[14px]"} mx-2 hover:text-white`}
                    ></i>
                </Tooltip>
            ) : (
                <Tooltip content="Unlike">
                    <i
                        onClick={(e) => {
                            e.stopPropagation();

                            dispatch(removeLike({ song_id }));
                            setLike(false);
                            dispatch(unLike({ user: session?.user, song_id }));
                        }}
                        className={`cursor-pointer icon-heart 
          text-[#2bb540] ${size ? size : "text-[15px]"} mx-2`}
                    ></i>
                </Tooltip>
            )}
        </div>
    );
}

export default LikeButton;
