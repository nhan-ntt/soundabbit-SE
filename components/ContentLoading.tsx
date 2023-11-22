import React from "react";
import { Spinner } from "@nextui-org/react";

export const ContentLoading = () => (
    <div
        className=" w-[calc(100vw_-_14rem_-_16px)] mini-laptop:w-[calc(100vw_-_55px)] 
        tablet:w-screen mobile:w-screen overflow-x-hidden  h-screen mobile:h-[calc(100vh_-_50px)] 
        tablet:h-[calc(100vh_-_50px)] flex flex-col items-center justify-center"
    >
        <Spinner
            className="mb-40"
            size="lg"
            color="success"
            labelColor="success"
        />
    </div>
);
