import { Outlet } from "@tanstack/react-router";
import { CommandMenu } from "../command-menu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

interface Props {
  children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div id="content">{children ? children : <Outlet />}</div>
        </SidebarInset>
      </SidebarProvider>
      <CommandMenu />
    </>
  );
}
