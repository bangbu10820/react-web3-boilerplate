import { forwardRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GradientDirection =
  | "to-r"
  | "to-l"
  | "to-t"
  | "to-b"
  | "to-tr"
  | "to-tl"
  | "to-br"
  | "to-bl";

const gradientDirectionMap: Record<GradientDirection, string> = {
  "to-r": "to right",
  "to-l": "to left",
  "to-t": "to top",
  "to-b": "to bottom",
  "to-tr": "to top right",
  "to-tl": "to top left",
  "to-br": "to bottom right",
  "to-bl": "to bottom left",
};

interface GradientBorderStyleOptions {
  gradientDirection?: GradientDirection;
  backgroundColor?: string;
  fromColor: string;
  toColor: string;
}

/**
 * Generate CSS style object for gradient border using padding-box/border-box technique
 * @param options - Configuration options for gradient border
 * @returns CSS style object with background property
 */
function getGradientBorderStyle(
  options: GradientBorderStyleOptions
): React.CSSProperties {
  const {
    gradientDirection = "to-r",
    backgroundColor = "transparent",
    fromColor,
    toColor,
  } = options;

  const direction = gradientDirectionMap[gradientDirection] || "to right";
  const background = `linear-gradient(${backgroundColor} 0 0) padding-box, linear-gradient(${direction}, ${fromColor}, ${toColor}) border-box`;

  return {
    background,
  };
}

interface OutlinedGradientButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant" | "style"> {
  gradientDirection?: GradientDirection;
  backgroundColor?: string;
  fromColor?: string;
  toColor?: string;
}

const OutlinedGradientButton = forwardRef<
  HTMLButtonElement,
  OutlinedGradientButtonProps
>(
  (
    {
      className,
      gradientDirection = "to-r",
      backgroundColor = "#fff",
      fromColor = "#6D4999",
      toColor = "#75B000",
      ...props
    },
    ref
  ) => {
    const gradientStyle = useMemo(
      () =>
        getGradientBorderStyle({
          gradientDirection,
          backgroundColor,
          fromColor,
          toColor,
        }),
      [gradientDirection, backgroundColor, fromColor, toColor]
    );

    return (
      <Button
        ref={ref}
        className={cn(
          "cursor-pointer border border-transparent hover:opacity-90",
          className
        )}
        variant="outline"
        style={gradientStyle}
        {...props}
      />
    );
  }
);

OutlinedGradientButton.displayName = "OutlinedGradientButton";

export { OutlinedGradientButton };
