export const BASE_API_URL = process.env.RHYME_API_URL;

const AUTH = {
    login: `${BASE_API_URL}/auth/login`,
    register: `${BASE_API_URL}/auth/register`,
}

const USER = {
    user: ({ userID }: { userID: any }) => `${BASE_API_URL}/users/${userID}`,
    favoriteSongs: ({ userID }: { userID: any }) => `${USER.user({ userID })}/favorite/songs`,
    favoriteSong: ({ userID, songID }: { userID: string, songID: string }) => `${USER.favoriteSongs({ userID })}/${songID}`,
}

const PLAYLIST = {
    playlists: `${BASE_API_URL}/playlists`,
    playlist: ({ playlistID }: { playlistID: any }) => `${BASE_API_URL}/playlists/${playlistID}`,
    playlistSongs: ({ playlistID }: { playlistID: any }) => `${PLAYLIST.playlist({ playlistID })}/songs`,
    playlistSong: ({ playlistID, songID }: { playlistID: string, songID: string }) => `${PLAYLIST.playlistSongs({ playlistID })}/${songID}`,
}

const GENRE = {
    genres: `${BASE_API_URL}/genres`,
    genre: ({ genreID }: { genreID: any }) => `${GENRE.genres}/${genreID}`,
    genreSongs: ({ genreID }: { genreID: any }) => `${GENRE.genre({ genreID })}/songs`,
}

const ARTIST = {
    artists: `${BASE_API_URL}/artists`,
    artist: ({ artistID }: { artistID: any }) => `${ARTIST.artists}/${artistID}`,
    artistSongs: ({ artistID }: { artistID: any }) => `${ARTIST.artist({ artistID })}/songs`,
}

const SONG = {
    songs: `${BASE_API_URL}/songs`,
    song: ({ songID }: { songID: any }) => `${SONG.songs}/${songID}`,
    songArtists: ({ songID }: { songID: string }) => `${SONG.song({ songID })}/artists`,
    listen: ({ songID }: { songID: string }) => `${SONG.song({ songID })}/listen`,
}

export const API = {
    ...AUTH,
    ...USER,
    ...PLAYLIST,
    ...GENRE,
    ...ARTIST,
    ...SONG,
}
