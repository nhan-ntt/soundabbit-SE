import { Song } from "@/interfaces/song";

import ScrollContainer from "react-indiana-drag-scroll";
import { useDispatch } from "react-redux";
import { setActiveSong } from "@/stores/player/currentAudioPlayer";

import HorizontalSongCard from "./HorizontalSongCard";

function HorizontalSongsList({ songs }: { songs: Song[] }) {
    const dispatch = useDispatch();

    return (
        <ScrollContainer
            vertical={false}
            horizontal={true}
            className="flex flex-row"
        >
            <div className="mx-4 mobile:mx-2 tablet:mx-6"></div>
            {songs.map((song: Song) => (
                <HorizontalSongCard
                    key={song.id}
                    song={song}
                    onClick={() =>
                        dispatch(
                            setActiveSong({
                                index: songs.indexOf(song),
                                songs: songs,
                            })
                        )
                    }
                />
            ))}
        </ScrollContainer>
    );
}

export default HorizontalSongsList;