import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full border border-neutral-charcoal bg-surface-dim px-4 py-2 font-label text-base text-foreground transition-colors file:border-0 file:bg-transparent file:font-label file:text-sm file:font-bold placeholder:text-outline focus-visible:outline-none focus-visible:border-tertiary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
