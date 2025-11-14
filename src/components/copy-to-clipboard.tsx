import { Slot } from "@radix-ui/react-slot";
import { useCallback } from "react";
import { useCopyToClipboardWithToast } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

export function CopyToClipboard({
  className,
  asChild,
  data,
  message = "Copied to clipboard",
  disabled = false,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  data: string;
  message?: string;
}) {
  const Comp = asChild ? Slot : "button";
  const [copy] = useCopyToClipboardWithToast();

  const handleClick = useCallback(() => {
    if (!disabled) {
      copy({ text: data, toastMessage: message });
    }
  }, [copy, data, message, disabled]);

  return (
    <Comp
      role="button"
      data-slot="copy-to-clipboard-trigger"
      className={cn(
        "text-primary disabled:text-muted-foreground cursor-pointer disabled:cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      aria-disabled={disabled}
      disabled={disabled}
      {...props}
    >
      {children || <DefaultCopyIcon />}
    </Comp>
  );
}

function DefaultCopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <g>
        <path
          d="M9.99967 0.666504H2.66634C1.93301 0.666504 1.33301 1.2665 1.33301 1.99984V10.6665C1.33301 11.0332 1.63301 11.3332 1.99967 11.3332C2.36634 11.3332 2.66634 11.0332 2.66634 10.6665V2.6665C2.66634 2.29984 2.96634 1.99984 3.33301 1.99984H9.99967C10.3663 1.99984 10.6663 1.69984 10.6663 1.33317C10.6663 0.966504 10.3663 0.666504 9.99967 0.666504ZM12.6663 3.33317H5.33301C4.59967 3.33317 3.99967 3.93317 3.99967 4.6665V13.9998C3.99967 14.7332 4.59967 15.3332 5.33301 15.3332H12.6663C13.3997 15.3332 13.9997 14.7332 13.9997 13.9998V4.6665C13.9997 3.93317 13.3997 3.33317 12.6663 3.33317ZM11.9997 13.9998H5.99967C5.63301 13.9998 5.33301 13.6998 5.33301 13.3332V5.33317C5.33301 4.9665 5.63301 4.6665 5.99967 4.6665H11.9997C12.3663 4.6665 12.6663 4.9665 12.6663 5.33317V13.3332C12.6663 13.6998 12.3663 13.9998 11.9997 13.9998Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
