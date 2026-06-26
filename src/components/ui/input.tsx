import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-full border border-white/5 bg-[#161616] px-4 py-2 text-sm text-white ring-offset-[#0B0B0B] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#FFFFFF] placeholder:text-[#7A7A7A] focus-visible:outline-none focus-visible:border-white/20 focus-visible:ring-1 focus-visible:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
