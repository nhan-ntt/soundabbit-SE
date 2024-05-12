import React from "react";
import { Button } from "@nextui-org/react";
import clsx from "clsx";

interface IProps {
    isPlaying: boolean;
    nextSong: () => void;
    prevSong: () => void;
    playPause: () => void;
    onRepeat: () => void;
    onShuffle: () => void;
    isShuffle: boolean;
    isRepeat: boolean;
    isFullScreen: boolean;
}
function Controls({
    isPlaying,
    prevSong,
    nextSong,
    playPause,
    isShuffle,
    isRepeat,
    onRepeat,
    onShuffle,
    isFullScreen,
}: IProps) {
    if (isFullScreen) {
        return (
            <div
                className="flex flex-row justify-between items-center mt-6 tablet:w-[400px] mobile:w-[320px]"
            >
                <div className="flex flex-col items-center mr-6 ">
                    <i
                        className={clsx(
                            `icon-shuffle mini-laptop:text-[18px] laptop:text-[20px]
              tablet:text-[18px] mobile:text-[18px]`,
                            isShuffle
                                ? "text-[#2bb540]"
                                : "text-gray-400 hover:text-white"
                        )}
                        onClick={onShuffle}
                    ></i>
                    <div
                        className={clsx(
                            `w-[3px] h-[3px] rounded-full my-1`,
                            isShuffle ? "bg-[#2bb540] block" : "hidden"
                        )}
                    ></div>
                </div>
                <div className="flex flex-row items-center">
                    <i
                        onClick={prevSong}
                        className="icon-Previous cursor-pointer text-gray-300
         hover:text-white text-[24px] mini-laptop:text-[20px] 
          tablet:text-[20px] mobile:text-[20px] laptop:text-[22px]"
                    ></i>

                    <Button
                        radius="full"
                        isIconOnly
                        onClick={playPause}
                        className="bg-white text-black 
                            p-1 text-center flex 
                            items-center justify-center
                            mini-laptop:h-10 mini-laptop:w-10
                            tablet:h-10 tablet:w-10
                            mobile:h-10 mobile:w-10
                            laptop:w-12 laptop:h-12
                            mx-6 scale-100 hover:scale-110 "
                    >
                        {!isPlaying ? (
                            <i className="icon-play text-[20px] ml-1" />
                        ) : (
                            <i className="icon-pause text-[20px]" />
                        )}
                    </Button>

                    <i
                        onClick={nextSong}
                        className="icon-Next cursor-pointer text-gray-300
          hover:text-white text-[24px]
            mini-laptop:text-[20px]
            tablet:text-[20px]
            mobile:text-[20px]
            laptop:text-[22px]"
                    ></i>
                </div>

                <div className="flex flex-col items-center ml-6 mr-2">
                    <i
                        onClick={onRepeat}
                        className={clsx(
                            "icon-repeat mini-laptop:text-[18px] laptop:text-[20px] tablet:text-[18px] mobile:text-[18px]",
                            isRepeat
                                ? "text-[#2bb540]"
                                : "text-gray-400 hover:text-white"
                        )}
                    ></i>
                    <div
                        className={clsx(
                            `w-[3px] h-[3px] rounded-full my-1 `,
                            isRepeat ? "bg-[#2bb540] block" : "hidden"
                        )}
                    ></div>
                </div>
            </div>
        );
    }
    return (
        <div
            className="flex flex-row justify-center items-center mb-2 mobile:justify-end"
        >
            <div className="flex flex-col items-center mr-6 mobile:hidden">
                <i
                    className={clsx(
                        `icon-shuffle text-[14px]`,
                        isShuffle
                            ? "text-[#2bb540]"
                            : "text-gray-400 hover:text-white"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        onShuffle();
                    }}
                ></i>
                <div
                    className={clsx(
                        `w-[3px] h-[3px] rounded-full my-1`,
                        isShuffle ? "bg-[#2bb540] block" : "hidden"
                    )}
                ></div>
            </div>

            <i
                onClick={(e) => {
                    e.stopPropagation();
                    prevSong();
                }}
                className="icon-Previous cursor-pointer text-gray-300 text-[14px]
         hover:text-white mobile:hidden"
            ></i>
            <Button
                isIconOnly
                radius="full"
                onClick={(e) => {
                    e.stopPropagation();
                    playPause();
                }}
                className="bg-white text-black 
            p-1 text-center flex 
            items-center justify-center
            mx-6 scale-100 hover:scale-110 mobile:mx-0"
            >
                {!isPlaying ? (
                    <i className="icon-play text-[14px] ml-0.5" />
                ) : (
                    <i className="icon-pause text-[12px]" />
                )}
            </Button>

            <i
                onClick={(e) => {
                    e.stopPropagation();
                    nextSong();
                }}
                className="icon-Next cursor-pointer text-gray-300
         hover:text-white mobile:hidden text-[14px]"
            ></i>

            <div className="flex flex-col items-center mx-6 mobile:hidden">
                <i
                    onClick={(e) => {
                        e.stopPropagation();
                        onRepeat();
                    }}
                    className={clsx(
                        "icon-repeat text-[14px]",
                        isRepeat
                            ? "text-[#2bb540]"
                            : "text-gray-400 hover:text-white"
                    )}
                ></i>
                <div
                    className={clsx(
                        `w-[3px] h-[3px] rounded-full my-1 `,
                        isRepeat ? "bg-[#2bb540] block" : "hidden"
                    )}
                ></div>
            </div>
        </div>
    );
}

export default Controls;
