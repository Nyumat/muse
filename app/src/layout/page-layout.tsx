import { useTheme } from "@/components/theme-provider";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
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

export function DashboardPageLayout({
  children,
  breadcrumbs,
}: {
  children: ReactNode;
  breadcrumbs: ReactNode;
}) {
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
        className={cn(
          "flex flex-col h-full bg-cover bg-center bg-fixed bg-no-repeat border border-prrimary rounded"
        )}
        style={{
          backgroundImage:
            resolvedTheme === "light"
              ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${BG_URL}')`
              : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${BG_URL}')`,
        }}
      >
        <header className="flex h-16 shrink-0 items-center gap-2 border-primary">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </>
  );
}
