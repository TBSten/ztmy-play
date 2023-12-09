import songs from "./data.json"
import { Song } from "./type"

export const getAllSongs = async (): Promise<Song[]> => {
    return songs.map(song => ({
        id: song.id,
        title: song.title,
        chorusTime: song.chorus_time,
    }))
}
