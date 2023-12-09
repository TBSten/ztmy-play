
import { getAllSongs } from "@/songs/getAll"
import { FC } from "react"
import Songs from "./Songs"

interface RandomSongPageProps {
}
const RandomSongPage: FC<RandomSongPageProps> = async () => {
    const songs = await getAllSongs()
    return (
        <div>
            <div className="text-center text-4xl font-bold my-2">
                ZUTOMAYO BINGO
            </div>
            <div className="p-4">
                <Songs songs={songs} />
            </div>
        </div>
    )
}

export default RandomSongPage
