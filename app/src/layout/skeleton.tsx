import { useTheme } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "./components/app-sidebar";

export function DashboardLayout() {
  const { theme } = useTheme();
  const resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const resolvedTheme = theme || resolved;
  const BG_URL =
    resolvedTheme === "light"
      ? `https://4kwallpapers.com/images/walls/thumbs_3t/10781.png`
      : `https://4kwallpapers.com/images/walls/thumbs_3t/19801.jpg`;
  return (
    <>
      <div
        className={`min-h-screen bg-cover bg-center bg-fixed bg-no-repeat bg-blend-darken text-white`}
        style={{
          backgroundImage:
            resolvedTheme === "light"
              ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${BG_URL}')`
              : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${BG_URL}')`,
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
