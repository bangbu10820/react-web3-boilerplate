import { createContext, use } from "react";
import type { ReactNode } from "react";
import type {
  TooltipContentProps,
  TooltipTriggerProps,
} from "@radix-ui/react-tooltip";
import type {
  PopoverContentProps,
  PopoverTriggerProps,
} from "@radix-ui/react-popover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

type ResponsiveTooltipContextType = {
  isMobile: boolean;
};

const ResponsiveTooltipContext = createContext<
  ResponsiveTooltipContextType | undefined
>(undefined);

type ResponsiveTooltipProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  delayDuration?: number;
  modal?: boolean;
};

function ResponsiveTooltip(props: ResponsiveTooltipProps) {
  const isMobile = useIsMobile();

  const Comp = isMobile ? Popover : Tooltip;

  return (
    <ResponsiveTooltipContext.Provider value={{ isMobile }}>
      <Comp {...props} />
    </ResponsiveTooltipContext.Provider>
  );
}
ResponsiveTooltip.displayName = "ResponsiveTooltip";

function ResponsiveTooltipTrigger(
  props: TooltipTriggerProps & PopoverTriggerProps
) {
  const { isMobile } = useResponsiveTooltip();

  const Comp = isMobile ? PopoverTrigger : TooltipTrigger;

  return <Comp {...props} />;
}
ResponsiveTooltipTrigger.displayName = "ResponsiveTooltipTrigger";

function ResponsiveTooltipContent(
  props: TooltipContentProps & PopoverContentProps
) {
  const { isMobile } = useResponsiveTooltip();

  const Comp = isMobile ? PopoverContent : TooltipContent;

  return <Comp {...props} />;
}
ResponsiveTooltipContent.displayName = "ResponsiveTooltipContent";

function useResponsiveTooltip() {
  const context = use(ResponsiveTooltipContext);
  if (!context) {
    throw new Error(
      "ResponsiveTooltip components must be used within a ResponsiveTooltip provider"
    );
  }
  return context;
}

export {
  ResponsiveTooltip,
  ResponsiveTooltipTrigger,
  ResponsiveTooltipContent,
};
