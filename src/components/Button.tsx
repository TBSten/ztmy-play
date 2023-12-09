import clsx from "clsx"
import { ComponentProps, FC } from "react"

interface ButtonProps extends ComponentProps<"button"> {
}
const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
    return (
        <button
            className={clsx(
                "rounded px-3 py-2 bg-purple-500 text-white hover:bg-purple-700 active:scale-95 transition-all duration-100 outline-8 outline-purple-200/80",
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
