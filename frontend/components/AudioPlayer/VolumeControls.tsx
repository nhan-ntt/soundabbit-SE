import { Slider, SliderValue, Tooltip } from "@nextui-org/react";
import React from "react";

interface IProps {
    volume: number;
    updateVolume: (e: any) => void;
    isFullScreen: boolean;
}

function VolumeControls({ volume, updateVolume, isFullScreen }: IProps) {
    const currentPercentage = 1 ? `${(volume / 1) * 100}%` : "0%";
    const songStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;
    const volumeIcon = () => {
        if (volume <= 1 && volume > 0.5) {
            return (
                <Tooltip content="Mute">
                    <i
                        className="cursor-pointer icon-volume-2
            text-gray-400 hover:text-white text-[22px] mobile:text-[18px]"
                        onClick={(e) => {
                            e.stopPropagation();

                            updateVolume(0);
                        }}
                    ></i>
                </Tooltip>
            )
        }

        if (volume <= 0.5 && volume > 0) {
            return (
                <Tooltip content="Mute">
                    <i
                        className=" cursor-pointer icon-volume-1
            text-gray-400 hover:text-white text-[22px] mobile:text-[18px]"
                        onClick={(e) => {
                            e.stopPropagation();
                            updateVolume(0);
                        }}
                    ></i>
                </Tooltip>
            )
        }
        return (
            <Tooltip content="Unmute">
                <i
                    className="cursor-pointer icon-volume-x
            text-gray-400 hover:text-white text-[22px] mobile:text-[18px]"
                    onClick={(e) => {
                        e.stopPropagation();
                        updateVolume(1);
                    }}
                ></i>
            </Tooltip>
        )
    }

    return (
        <Slider
            size="sm"
            className="w-[120px]"
            color={"foreground"}
            step={0.01}
            value={volume}
            maxValue={1}
            minValue={0}
            aria-label="Temperature"
            defaultValue={0}
            onChange={(value: SliderValue) => updateVolume(value)}
            startContent={volumeIcon()}
        />
    );
}

export default VolumeControls;
