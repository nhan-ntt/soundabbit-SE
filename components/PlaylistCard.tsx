import React from "react";
import { Image } from "@nextui-org/react";
import { Playlist } from "@/interfaces/playlist";
import Link from "next/link";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
    return (
        <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
            <div
                className="cursor-pointer p-3.5 bg-gradient-to-t from-[#2c2a2a4a] to-[#2c2a2ac7] hover:bg-[#4340409d]
           tablet:hover:bg-transparent mobile:hover:bg-transparent 
           rounded h-full mini-laptop:p-3 tablet:p-0 tablet:from-transparent tablet:to-transparent
           mobile:from-transparent mobile:to-transparent mobile:p-0 mobile:mr-0
           "
            >
                <div className="p-0 m-0 rounded">
                    <Image
                        src={playlist.image_link}
                        width="300"
                        height="300"
                        alt="playlist cover image"
                    />
                </div>

                <div className="py-3">
                    <p className="">{playlist.name}</p>
                    <p className="text-gray-300 text-sm mt-1"></p>
                </div>
            </div>
        </Link>
    );
}
