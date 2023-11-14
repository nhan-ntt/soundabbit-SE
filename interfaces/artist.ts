export interface Artists {
    id: number;
    name: string;
    avatar?: Avatar;
}

export interface Avatar {
    url: string;
    color: string;
}

export const tracksToArtists = (tracks: any) => {
    return tracks.map((track: any) => {
        return {
            id: track.artist_id,
            name: track.artist_name,
        };
    });
};
