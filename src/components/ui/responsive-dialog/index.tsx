import { createContext, use } from "react";
import type { ReactNode } from "react";
import * as DrawerPrimitive from "@/components/ui/drawer";
import * as DialogPrimitive from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

type ResponsiveDialogContextType = {
  isMobile: boolean;
};

const ResponsiveDialogContext = createContext<
  ResponsiveDialogContextType | undefined
>(undefined);

// Base props that are common to both Dialog and Drawer
type BaseResponsiveDialogProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

// Conditional props based on component type
type ResponsiveDialogProps = BaseResponsiveDialogProps & {
  // Props specific to dialog mode
  dialogProps?: Omit<
    React.ComponentProps<typeof DialogPrimitive.Dialog>,
    keyof BaseResponsiveDialogProps
  >;
  // Props specific to drawer mode
  drawerProps?: Omit<
    React.ComponentProps<typeof DrawerPrimitive.Drawer>,
    keyof BaseResponsiveDialogProps
  >;
};

// Helper function to create responsive components
function createResponsiveComponent<
  TMobile extends React.ComponentType<any>,
  TDesktop extends React.ComponentType<any>,
>(MobileComponent: TMobile, DesktopComponent: TDesktop) {
  return function ResponsiveComponent({
    ...props
  }: React.ComponentProps<TMobile> & React.ComponentProps<TDesktop>) {
    const context = use(ResponsiveDialogContext);
    if (!context) {
      throw new Error(
        "ResponsiveDialog components must be used within a ResponsiveDialog provider"
      );
    }
    const { isMobile } = context;
    const Comp = isMobile ? MobileComponent : DesktopComponent;
    return <Comp {...props} />;
  };
}

function ResponsiveDialog({
  drawerProps,
  dialogProps,
  ...props
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  const Comp = isMobile ? DrawerPrimitive.Drawer : DialogPrimitive.Dialog;
  const specificProps = isMobile ? drawerProps : dialogProps;

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      <Comp {...props} {...specificProps} />
    </ResponsiveDialogContext.Provider>
  );
}

// Create all responsive components using the helper
const ResponsiveDialogTrigger = createResponsiveComponent<
  typeof DrawerPrimitive.DrawerTrigger,
  typeof DialogPrimitive.DialogTrigger
>(DrawerPrimitive.DrawerTrigger, DialogPrimitive.DialogTrigger);

const ResponsiveDialogContent = createResponsiveComponent<
  typeof DrawerPrimitive.DrawerContent,
  typeof DialogPrimitive.DialogContent
>(DrawerPrimitive.DrawerContent, DialogPrimitive.DialogContent);

const ResponsiveDialogHeader = createResponsiveComponent<
  typeof DrawerPrimitive.DrawerHeader,
  typeof DialogPrimitive.DialogHeader
>(DrawerPrimitive.DrawerHeader, DialogPrimitive.DialogHeader);

const ResponsiveDialogFooter = createResponsiveComponent<
  typeof DrawerPrimitive.DrawerFooter,
  typeof DialogPrimitive.DialogFooter
>(DrawerPrimitive.DrawerFooter, DialogPrimitive.DialogFooter);

const ResponsiveDialogTitle = createResponsiveComponent<
  typeof DrawerPrimitive.DrawerTitle,
  typeof DialogPrimitive.DialogTitle
>(DrawerPrimitive.DrawerTitle, DialogPrimitive.DialogTitle);

const ResponsiveDialogDescription = createResponsiveComponent<
  typeof DrawerPrimitive.DrawerDescription,
  typeof DialogPrimitive.DialogDescription
>(DrawerPrimitive.DrawerDescription, DialogPrimitive.DialogDescription);

const ResponsiveDialogClose = createResponsiveComponent<
  typeof DrawerPrimitive.DrawerClose,
  typeof DialogPrimitive.DialogClose
>(DrawerPrimitive.DrawerClose, DialogPrimitive.DialogClose);

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogClose,
};
