import React from "react";
import { Playlist } from "@/interfaces/playlist";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
    const router = useRouter();

    return (
        <Card
            isPressable
            onPress={() => router.push(`/playlist/${playlist.id}`)}
        >
            <CardBody>
                <Image
                    alt={playlist.name}
                    className="w-full object-cover min-h-[180px]"
                    src={playlist.image_link}
                />
            </CardBody>
            <CardFooter>
                <p>{playlist.name}</p>
            </CardFooter>
        </Card>
    );
}
