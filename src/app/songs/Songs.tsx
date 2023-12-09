"use client"

import Button from "@/components/Button"
import Dialog, { DialogProps, useDialog } from "@/components/Dialog"
import { Song } from "@/songs/type"
import { useLocalStorage } from "@/util/useLocalStorage"
import { motion } from "framer-motion"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
import toast from "react-hot-toast"
import YouTube from "react-youtube"
import SongsList from "./SongsList"

interface SongsProps {
    songs: Song[]
}
const Songs: FC<SongsProps> = ({ songs }) => {
    const [selectSongIds, setSelectSongIds, { clear, isLoading }] = useLocalStorage<Song["id"][]>("select-songs", [])
    const randomDialog = useDialog()
    const handleOpenDialog = () => {
        if (songs.length === selectSongIds.length) {
            toast.error("全ての曲が抽選済みです")
            return
        }
        randomDialog.onOpen()
    }
    const handleToggleSelectSong = (songId: Song["id"]) => setSelectSongIds(p => {
        const targetSong = songs.find(s => s.id === songId)
        if (!targetSong) throw new Error(`invalid song id ${songId}. not found song .`)
        if (p.includes(songId)) {
            return p.filter(id => id !== songId)
        } else {
            return [...p, songId]
        }
    })
    return (
        <div>
            <div className="text-center my-6">
                {selectSongIds.length}/{songs.length}
            </div>

            <SongsList
                songs={songs}
                selectSongIds={selectSongIds}
                isLoading={isLoading}
                onToggleSelectSong={handleToggleSelectSong}
            />

            <hr className="my-24" />

            <h2 className="text-xl font-bold">
                抽選済みの楽曲
                {" "}
                ({selectSongIds.length} / {songs.length})
            </h2>

            {selectSongIds.map(id => {
                const song = songs.find(s => s.id === id)
                if (!song) return <>...</>
                return (
                    <div key={song.id} className="px-2 my-4">
                        <Link href={`https://youtu.be/${song.id}`} className="text-xl text-blue-600 underline visited:text-purple-800" target="_blank">
                            {song.title}
                        </Link>
                    </div>
                )
            })}

            <hr className="my-24" />

            <h2 className="text-xl font-bold">
                未抽選の楽曲
                {" "}
                ({songs.length - selectSongIds.length} / {songs.length})
            </h2>

            {songs
                .filter(s => !selectSongIds.includes(s.id))
                .map(song => (
                    <div key={song.id} className="px-2 my-4">
                        <Link href={`https://youtu.be/${song.id}`} className="text-xl text-blue-600 underline visited:text-purple-800">
                            {song.title}
                        </Link>
                    </div>
                ))}

            <div className="fixed right-2 bottom-2 flex gap-2">
                <Button onClick={handleOpenDialog}>
                    ⭐️
                    抽選
                </Button>
                {selectSongIds.length === 0
                    ? <Button onClick={() => setSelectSongIds(songs.map(song => song.id))}>
                        全て抽選済みにする
                    </Button>
                    : <Button onClick={clear}>
                        リセット
                    </Button>
                }
            </div>

            <RandomSelectDialog
                key={String(randomDialog.open)}
                songs={songs}
                selectedSongIds={selectSongIds}
                onSelectSong={(id) => {
                    const targetSong = songs.find(s => s.id === id)
                    if (!targetSong) throw new Error(`invalid song id ${id}. not found song`)
                    toast.success(`${targetSong.title}を抽選済みにしました！`)
                    handleToggleSelectSong(id)
                }}
                {...randomDialog.dialogProps}
            />
        </div>
    )
}

export default Songs

type RandomSelectDialogProps = Omit<DialogProps, "children"> & {
    songs: Song[]
    selectedSongIds: Song["id"][]
    onSelectSong: (id: Song["id"]) => void
}
const RandomSelectDialog: FC<RandomSelectDialogProps> = ({ onClose, songs, selectedSongIds, onSelectSong, ...props }) => {
    const initCount = 3
    const [count, setCount] = useState(initCount)
    const [result, setResult] = useState<null | Song>(null)
    useEffect(() => {
        if (!props.open) return
        async function animation() {
            setResult(null)
            const noneSelectedSongs = songs.filter(song => !selectedSongIds.includes(song.id))
            const randomSong = noneSelectedSongs[Math.floor(Math.random() * noneSelectedSongs.length)]
            if (!randomSong) return
            // await sleep(1200)
            // setCount(2)
            // await sleep(1200)
            // setCount(1)
            // await sleep(1200)
            setCount(0)
            setResult(randomSong)
        }
        animation()
    }, [props.open, selectedSongIds, songs])
    return (
        <Dialog onClose={() => { }} {...props}>
            <div className="w-full min-h-[80%]">
                <div className="text-3xl md:text-5xl font-bold text-center text-gray-500 py-12">
                    {count !== 0
                        ? count
                        : result !== null
                            ? <div>
                                <motion.div className="my-6 text-purple-600"
                                    animate={{
                                        opacity: [0, 1],
                                        transform: ["scale(0.7)", "scale(1.0)"],
                                    }}
                                    transition={{ delay: 3.5, duration: 1.0 }}
                                >
                                    <Link href={`https://youtu.be/${result.id}`} className="hover:underline" target="_blank">
                                        {result.title}
                                    </Link>
                                </motion.div>
                                <motion.div
                                    animate={{
                                        opacity: [0, 1],
                                    }}
                                    transition={{ delay: 0.5, duration: 1.0 }}
                                    className="flex justify-center"
                                >
                                    <YouTube
                                        className="w-full"
                                        iframeClassName="w-full aspect-video"
                                        videoId={result.id}
                                        opts={{
                                            playerVars: {
                                                autoplay: 1,
                                                controls: 0,
                                                start: result.chorusTime,
                                                loop: 1,
                                            },
                                        }}
                                    />
                                </motion.div>
                            </div>
                            : "エラー"
                    }
                </div>
                <div className="flex justify-around pt-4 gap-2 p-4">
                    <Button onClick={onClose}>
                        選択せずに閉じる
                    </Button>
                    {result &&
                        <Button onClick={() => {
                            if (result) {
                                onClose()
                                onSelectSong(result?.id)
                            }
                        }}>
                            ✅ 選択して閉じる
                        </Button>
                    }
                </div>
            </div>
        </Dialog>
    )
}

