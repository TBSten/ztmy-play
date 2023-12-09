import { FC, ReactNode, useState } from "react"

export interface DialogProps {
    open: boolean
    onClose: () => void
    children: ReactNode
}
const Dialog: FC<DialogProps> = ({ open, onClose, children }) => {
    return (
        open &&
        <div className="fixed left-0 top-0 w-screen h-screen">
            <div className="w-full h-full bg-black/20 flex justify-center items-center p-4" onClick={() => { onClose() }}>
                <div className="bg-white rounded-lg max-w-full max-h-full overflow-auto" onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Dialog

export const useDialog = () => {
    const [open, setOpen] = useState(false)
    const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)
    const onToggle = () => setOpen(p => !p)
    const dialogProps = {
        open,
        onClose,
    } satisfies Partial<DialogProps>
    return {
        open,
        onOpen,
        onClose,
        onToggle,
        dialogProps,
    }
}


