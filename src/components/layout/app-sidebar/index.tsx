import * as React from "react";
import {
  IconDashboard,
  IconError404,
  IconHelp,
  IconInnerShadowTop,
  IconLock,
  IconServer,
  IconSettings,
  IconTool,
  IconUsers,
} from "@tabler/icons-react";

import { FormattedMessage } from "react-intl";
import { Link } from "@tanstack/react-router";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Error - 401",
      url: "/401",
      icon: IconUsers,
    },
    {
      title: "Error - 403",
      url: "/403",
      icon: IconLock,
    },
    {
      title: "Error - 404",
      url: "/404",
      icon: IconError404,
    },
    {
      title: "Error - 500",
      url: "/500",
      icon: IconServer,
    },
    {
      title: "Error - 503",
      url: "/503",
      icon: IconTool,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help Center",
      url: "#",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  <FormattedMessage id="app_title" />
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
