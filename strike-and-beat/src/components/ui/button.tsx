import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "dark"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Brutalist styling base
    const baseStyles = "inline-flex items-center justify-center font-label font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:pointer-events-none disabled:opacity-50"
    
    // Variants
    const variants = {
      primary: "bg-primary text-surface hover:bg-tertiary hover:text-surface border-2 border-primary hover:border-tertiary",
      secondary: "bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-surface",
      tertiary: "bg-tertiary text-surface hover:bg-primary hover:text-surface border-2 border-tertiary hover:border-primary",
      outline: "border-2 border-outline-variant bg-transparent text-on-surface hover:border-on-surface",
      dark: "bg-black text-white hover:bg-white hover:text-black border-2 border-black",
    }
    
    // Sizes
    const sizes = {
      default: "h-12 px-6 py-2 text-base",
      sm: "h-10 px-4 text-sm",
      lg: "h-14 px-8 text-lg",
      icon: "h-12 w-12",
    }
    
    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    return (
      <Comp
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
