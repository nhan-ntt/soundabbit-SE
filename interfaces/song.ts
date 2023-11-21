export interface Song {
    id: number;
    name: string;
    audio_link: string;
    image_link?: string;
    streams: number;
}

export const toSongProps = (songs: any): Song[] => {
    return songs.map((song: any) => {
        return {
            id: song.id,
            name: song.name,
            audio_link: song.audio_link,
            image_link: song.streams,
            streams: song.streams,
        };
    });
};
