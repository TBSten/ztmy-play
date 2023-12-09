import { Song } from "@/songs/type"
import clsx from "clsx"
import { FC } from "react"

interface SongsListProps {
    songs: Song[]
    selectSongIds: Song["id"][]
    onToggleSelectSong: (id: Song["id"]) => void
    isLoading: boolean
}
const SongsList: FC<SongsListProps> = ({ songs, selectSongIds, onToggleSelectSong, isLoading }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {songs.map((song) =>
                <button
                    key={song.id}
                    className={clsx(
                        "p-2 text-2xl border border-gray-400 text-purple-700",
                        selectSongIds.includes(song.id) && "bg-purple-300 text-purple-200",
                        "disabled:bg-gray-200 disabled:text-gray-200"
                    )}
                    onClick={() => onToggleSelectSong(song.id)}
                    disabled={isLoading}
                >
                    {selectSongIds.includes(song.id) && "✅ "}
                    {song.title}
                </button>
            )}
        </div>
    )
}

export default SongsList
