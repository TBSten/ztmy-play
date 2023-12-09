"use client"

import { FC, ReactNode } from "react"
import { Toaster } from "react-hot-toast"

interface ProvidersProps {
    children: ReactNode
}
const Providers: FC<ProvidersProps> = ({ children }) => {
    return (
        <>
            {children}
            <Toaster
                position="bottom-center"
            />
        </>
    )
}

export default Providers
