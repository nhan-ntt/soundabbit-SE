import { playPause } from "@/stores/player/currentAudioPlayer";
import clsx from "clsx";
import { useDispatch } from "react-redux";

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
            <div className={clsx("absolute w-full h-full bg-black bg-opacity-10 z-10 flex justify-end items-end rounded", className)}>
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

