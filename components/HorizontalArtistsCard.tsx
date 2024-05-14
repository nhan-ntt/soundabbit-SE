import React from "react";
import { Artist } from "@/interfaces/artist";
import { Image } from "@nextui-org/react";

function HorizontalArtistCard({
    artist,
    onClick,
}: {
    artist: Artist;
    onClick: () => void;
}) {
    return (
        <div key={artist.id} className="mr-4 cursor-grab" onClick={onClick}>
            <div
                className="p-4 bg-gradient-to-t from-[#2c2a2a4a] to-[#2c2a2ac7] hover:bg-[#4340409d]
           tablet:hover:bg-transparent mobile:hover:bg-transparent
           rounded h-full mini-laptop:p-3 tablet:p-0 tablet:from-transparent tablet:to-transparent
           mobile:from-transparent mobile:to-transparent mobile:p-0 transition-all
           "
            >
                <div
                    className="w-[160px] h-[160px] relative rounded-full 
          mini-laptop:w-[140px] mini-laptop:h-[140px] 
          tablet:w-[130px] tablet:h-[130px] mobile:w-[100px] mobile:h-[100px]"
                >
                    <Image
                        alt=""
                        src={artist.image_link}
                        className="w-[160px] h-[160px]  
                    object-cover
          mini-laptop:w-[140px] mini-laptop:h-[140px] 
          tablet:w-[130px] tablet:h-[130px] mobile:w-[100px] mobile:h-[100px] rounded-full"
                    />
                </div>
                <p className="line-clamp-2 mobile:text-center tablet:text-center mt-4 text-base mobile:text-sm tablet:text-sm">
                    {artist.name}
                </p>
                <p
                    className="line-clamp-2 mt-0.5 text-sm text-gray-400 
             mobile:text-xs tablet:text-xs
            mobile:text-center tablet:text-center "
                >
                    Artist
                </p>
            </div>
        </div>
    );
}

export default HorizontalArtistCard;