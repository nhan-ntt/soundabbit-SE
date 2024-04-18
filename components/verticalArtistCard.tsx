import React from "react";
import { Artist } from "@/interfaces/artist";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function VerticalArtistCard({ artist }: { artist: Artist }) {
    const router = useRouter();

    return (
        <div
            key={artist.id}
            onClick={() => router.push(`/artist/${artist.id}`)}
            className="flex flex-row items-center
                      w-full bg-[#5f5d5d60]
                      rounded cursor-pointer hover:bg-[#5f5d5da1] transition-all duration-100"
        >
            <Image
                alt=""
                src={artist.image_link}
                className="
                object-cover
                relative w-20 h-20 mini-laptop:w-16 mini-laptop:h-16
                rounded-none rounded-tl-md rounded-bl-md tablet:w-16 tablet:h-16 mobile:w-14 mobile:h-14"
            />
            <div></div>
            <p className="p-4 mini-laptop:p-2 tablet:p-2 tablet:text-[15px] mobile:p-0 mobile:px-2 mobile:text-[14px]">
                {artist.name}
            </p>
        </div>
    );
}
