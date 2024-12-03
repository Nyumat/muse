import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BG_URL } from "@/main";
import { Outlet } from "react-router";
import { AppSidebar } from "./components/app-sidebar";

export const iframeHeight = "800px";

export const description = "An inset sidebar with secondary navigation.";

export function DashboardLayout() {
  return (
    <>
      <div
        className={`min-h-screen bg-cover bg-center bg-fixed bg-no-repeat bg-blend-darken bg-opacity-50`}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${BG_URL}')`,
        }}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
