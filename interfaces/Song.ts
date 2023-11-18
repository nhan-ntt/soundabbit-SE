export interface SongProps {
    id: number;
    name: string;
    audio_link: string;
    cover_image?: string;
    streams: number,
}

export const toSongProps = (songs: any): SongProps[] => {
    return songs.map((song: any) => {
        return {
            id: song.id,
            name: song.name,
            audio_link: song.audio_link,
        };
    });
};
