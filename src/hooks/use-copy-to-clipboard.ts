import { useCallback, useState } from "react";
import { toast } from "sonner";

export type UseCopyToClipboardReturn = [
  (text: string) => Promise<void>,
  boolean,
];

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.warn("Copy failed", error);
      setIsCopied(false);
    }
  }, []);

  return [copy, isCopied];
};

type UseCopyToClipboardWithToastReturn = [
  (params: {
    text: string;
    showToast?: boolean;
    toastMessage?: string;
  }) => Promise<void>,
  boolean,
];

export const useCopyToClipboardWithToast =
  (): UseCopyToClipboardWithToastReturn => {
    const [copy, isCopied] = useCopyToClipboard();

    const overrideCopy = useCallback(
      async ({
        text,
        showToast = true,
        toastMessage = "Copied to clipboard",
      }: {
        text: string;
        showToast?: boolean;
        toastMessage?: string;
      }): Promise<void> => {
        return copy(text).then(() => {
          if (showToast) {
            toast.success(toastMessage);
          }
        });
      },
      [copy]
    );

    return [overrideCopy, isCopied];
  };
