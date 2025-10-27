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

function Provider(props: ResponsiveTooltipProps) {
  const isMobile = useIsMobile();

  const Comp = isMobile ? Popover : Tooltip;

  return (
    <ResponsiveTooltipContext.Provider value={{ isMobile }}>
      <Comp {...props} />
    </ResponsiveTooltipContext.Provider>
  );
}

function Trigger(props: TooltipTriggerProps & PopoverTriggerProps) {
  const { isMobile } = use(ResponsiveTooltipContext)!;

  const Comp = isMobile ? PopoverTrigger : TooltipTrigger;

  return <Comp {...props} />;
}

function Content(props: TooltipContentProps & PopoverContentProps) {
  const { isMobile } = use(ResponsiveTooltipContext)!;

  const Comp = isMobile ? PopoverContent : TooltipContent;

  return <Comp {...props} />;
}

export const ResponsiveTooltip = Provider;
export const ResponsiveTooltipTrigger = Trigger;
export const ResponsiveTooltipContent = Content;
