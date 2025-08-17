import React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  IconArrowRightDashed,
  IconDeviceLaptop,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { FormattedMessage } from "react-intl";
import { ScrollArea } from "./ui/scroll-area";
import { useSearch } from "@/context/search-context";
import { useTheme } from "@/context/theme-context";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup
            heading={
              <FormattedMessage id="command_menu_command_group_suggestions" />
            }
          >
            <CommandItem
              value="Dashboard"
              onSelect={() => {
                runCommand(() => navigate({ to: "/" }));
              }}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center">
                <IconArrowRightDashed className="text-muted-foreground/80 size-2" />
              </div>
              <FormattedMessage id="command_menu_dashboard" />
            </CommandItem>
          </CommandGroup>
          <CommandGroup
            heading={<FormattedMessage id="command_menu_command_group_pages" />}
          >
            <CommandItem
              value="401"
              onSelect={() => {
                runCommand(() => navigate({ to: "/401" }));
              }}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center">
                <IconArrowRightDashed className="text-muted-foreground/80 size-2" />
              </div>
              <FormattedMessage id="command_menu_command_group_pages_401" />
            </CommandItem>
            <CommandItem
              value="403"
              onSelect={() => {
                runCommand(() => navigate({ to: "/403" }));
              }}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center">
                <IconArrowRightDashed className="text-muted-foreground/80 size-2" />
              </div>
              <FormattedMessage id="command_menu_command_group_pages_403" />
            </CommandItem>
            <CommandItem
              value="404"
              onSelect={() => {
                runCommand(() => navigate({ to: "/404" }));
              }}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center">
                <IconArrowRightDashed className="text-muted-foreground/80 size-2" />
              </div>
              <FormattedMessage id="command_menu_command_group_pages_404" />
            </CommandItem>
            <CommandItem
              value="500"
              onSelect={() => {
                runCommand(() => navigate({ to: "/500" }));
              }}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center">
                <IconArrowRightDashed className="text-muted-foreground/80 size-2" />
              </div>
              <FormattedMessage id="command_menu_command_group_pages_500" />
            </CommandItem>
            <CommandItem
              value="503"
              onSelect={() => {
                runCommand(() => navigate({ to: "/503" }));
              }}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center">
                <IconArrowRightDashed className="text-muted-foreground/80 size-2" />
              </div>
              <FormattedMessage id="command_menu_command_group_pages_503" />
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup
            heading={<FormattedMessage id="command_menu_command_group_theme" />}
          >
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <IconSun />{" "}
              <span>
                <FormattedMessage id="command_menu_theme_switch_light" />
              </span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <IconMoon className="scale-90" />
              <span>
                <FormattedMessage id="command_menu_theme_switch_dark" />
              </span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <IconDeviceLaptop />
              <span>
                <FormattedMessage id="command_menu_theme_switch_system" />
              </span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
