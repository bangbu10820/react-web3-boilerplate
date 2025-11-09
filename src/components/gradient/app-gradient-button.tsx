import * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

const gradientButtonVariants = cva(
  "shadow-xs hover:opacity-90 transition-opacity font-medium cursor-pointer",
  {
    variants: {
      variant: {
        default: "from-[#B57AFF] to-[#6D4999] text-white",
        secondary: "from-[#2B1B3E] to-[#1E122C] text-primary",
      },
      gradientDirection: {
        "to-r": "bg-linear-to-r",
        "to-l": "bg-linear-to-l",
        "to-t": "bg-linear-to-t",
        "to-b": "bg-linear-to-b",
        "to-tr": "bg-linear-to-tr",
        "to-tl": "bg-linear-to-tl",
        "to-br": "bg-linear-to-br",
        "to-bl": "bg-linear-to-bl",
      },
    },
    defaultVariants: {
      variant: "default",
      gradientDirection: "to-r",
    },
  }
);

export interface AppGradientButtonProps
  extends Omit<ButtonProps, "variant">,
    VariantProps<typeof gradientButtonVariants> {}

const AppGradientButton = React.forwardRef<
  HTMLButtonElement,
  AppGradientButtonProps
>(({ className, variant, gradientDirection, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        gradientButtonVariants({ variant, gradientDirection }),
        className
      )}
      {...props}
    />
  );
});

AppGradientButton.displayName = "AppGradientButton";

export { AppGradientButton, gradientButtonVariants };
