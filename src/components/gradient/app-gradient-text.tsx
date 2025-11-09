import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface AppGradientTextProps extends React.ComponentProps<"span"> {
  asChild?: boolean;
}

const AppGradientText = React.forwardRef<HTMLSpanElement, AppGradientTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={cn(
          "bg-linear-to-r from-[#B57AFF] to-[#6D4999] bg-clip-text text-transparent",
          className
        )}
        {...props}
      />
    );
  }
);

AppGradientText.displayName = "AppGradientText";

export { AppGradientText };
