import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export const useLocalStorage = <T,>(key: string, init: T) => {
    const pathname = usePathname()
    key = `${pathname.replaceAll("/", "-")}-${key}`

    const [state, setState] = useState(init)
    const handleSetState: typeof setState = (action) => {
        setState(p => {
            const newState = action instanceof Function ? action(p) : action
            updateLocalStorage(newState)
            return newState
        })
    }

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        function load() {
            const data = localStorage.getItem(key)
            if (data === null) return
            const item = JSON.parse(data)
            setState(item)
        }
        load()
        setIsLoading(false)
    }, [key])

    const updateLocalStorage = useCallback((s: T = state) => {
        localStorage.setItem(key, JSON.stringify(s))
    }, [key, state])

    const clearLocalStorage = useCallback(() => {
        localStorage.removeItem(key)
        setState(init)
    }, [init, key])

    return [state, handleSetState, { updateLocalStorage, clear: clearLocalStorage, isLoading }] as const
}