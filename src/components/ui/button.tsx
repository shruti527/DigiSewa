import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#1E88E5] text-white hover:bg-[#1565C0] hover:shadow-lg transform hover:scale-105", // Blue button
        destructive:
          "bg-[#E53935] text-white hover:bg-[#C62828]", // Red button
        outline:
          "border border-[#1E88E5] text-[#1E88E5] bg-white hover:bg-[#1E88E5] hover:text-white", // Blue outline
        secondary:
          "bg-gray-500 text-white hover:bg-gray-600", // 🔹 Changed from brown to neutral gray
        ghost: "hover:bg-gray-100 hover:text-gray-900", // Subtle ghost
        link: "text-[#1E88E5] underline-offset-4 hover:underline", // Blue link
        government:
          "bg-gradient-to-r from-[#1565C0] to-[#1E88E5] text-white hover:shadow-lg transform hover:scale-105", // Blue gradient
        success:
          "bg-[#43A047] text-white hover:bg-[#2E7D32]", // Green
        warning:
          "bg-[#FDD835] text-black hover:bg-[#FBC02D]", // Yellow
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
