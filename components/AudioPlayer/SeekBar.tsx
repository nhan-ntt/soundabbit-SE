import { IStateProps, playPause, setSeekTime } from "@/stores/player/currentAudioPlayer";
import { Slider, SliderValue } from "@nextui-org/react";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function SeekBar({ className, ...props }: any) {
    const getTime = (time: any) => {
        return `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;
    }

    const {
        isPlaying,
        currentTime,
        duration
    }: IStateProps = useSelector((state: any) => state.player);

    const [time, changeTime] = useState<any>(currentTime);
    const [seeking, setSeeking] = useState<any>(false);

    useEffect(() => {
        if (!seeking) {
            changeTime(currentTime);
        }
    }, [currentTime]);

    const dispatch = useDispatch();

    const seek = (value: any) => {
        setSeeking(false);
        dispatch(setSeekTime(value));
    };

    return (
        <Slider
            {...props}
            className={clsx(className, 'text-gray-300 text-md')}
            size="md"
            color={"foreground"}
            step={0.01}
            value={time}
            maxValue={duration}
            minValue={0}
            defaultValue={0}
            onChangeEnd={(value: SliderValue) => seek(value)}
            onChange={(value: SliderValue) => {
                changeTime(value.valueOf())
                setSeeking(true);
            }}
            startContent={<span className="block min-w-[50px] text-center">{time ? getTime(time) : "0:00"}</span>}
            endContent={<span className="block min-w-[50px] text-center">{getTime(duration)}</span>}
        />
    );
}

export default SeekBar;
