import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md p-1 overflow-hidden text-sm font-medium ring-offset-white transition-colors hover:bg-gray-500 hover:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:ring ring-white data-[state=on]:text-zinc-900 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2 dark:ring-offset-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-400 dark:focus-visible:ring-zinc-300 dark:data-[state=on]:bg-zinc-800 dark:data-[state=on]:text-zinc-50",
  {
    variants: {
      variant: {
        default: "bg-tertiary",
        outline:
          "border border-zinc-200 bg-transparent hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11",
        toolbar: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "toolbar",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
