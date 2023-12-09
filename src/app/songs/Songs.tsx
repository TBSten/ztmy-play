"use client"

import Button from "@/components/Button"
import Dialog, { DialogProps, useDialog } from "@/components/Dialog"
import { Song } from "@/songs/type"
import { sleep } from "@/util/sleep"
import { useLocalStorage } from "@/util/useLocalStorage"
import clsx from "clsx"
import { motion } from "framer-motion"
import { FC, useEffect, useState } from "react"
import toast from "react-hot-toast"
import YouTube from "react-youtube"

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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {songs.map(song =>
                    <button
                        key={song.id}
                        className={clsx(
                            "p-2 text-2xl border border-gray-400",
                            selectSongIds.includes(song.id) && "bg-purple-300",
                            "disabled:bg-gray-200 disabled:text-gray-200"
                        )}
                        onClick={() => handleToggleSelectSong(song.id)}
                        disabled={isLoading}
                    >
                        {selectSongIds.includes(song.id) && "✅ "}
                        {song.title}
                    </button>
                )}
            </div>

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
            await sleep(1200)
            setCount(2)
            await sleep(1200)
            setCount(1)
            await sleep(1200)
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
                                    {result.title}
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

