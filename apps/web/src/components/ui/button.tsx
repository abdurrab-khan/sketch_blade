import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-primary-bg-dark dark:focus-visible:ring-blue-500",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
        destructive:
          "bg-red-500 text-zinc-50 hover:bg-red-500/90 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        outline:
          "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-blue-500/20 dark:bg-secondary-bg-dark dark:text-slate-200 dark:hover:bg-blue-500/10 dark:hover:text-white",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-blue-500/20 dark:text-slate-200 dark:hover:bg-blue-500/30",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-blue-500/10 dark:hover:text-white",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-blue-400",
        none: "bg-transparent text-zinc-50 dark:text-zinc-900",
        app: "bg-tertiary text-zinc-50 hover:bg-tertiary/90 dark:bg-tertiary dark:text-zinc-50 hover:text-zinc-200 dark:hover:bg-tertiary/90",
        delete:
          "bg-red-500 text-zinc-50 hover:bg-red-500/90 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        primary: "primary__btn",
        recover:
          "bg-linear-to-r from-orange-400 to-orange-500 text-white/90 border border-slate-500/20 hover:opacity-85 active:opacity-100 dark:from-orange-500 dark:to-orange-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        none: "p-0 w-full",
        recover: "px-2.5 py-2 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
