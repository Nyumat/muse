import { SidebarProvider } from "@/components/ui/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { MuseSidebar } from "./components/app-sidebar";
import { MiniPlayer } from "@/components/mini-player";

type BreadcrumbSegment = {
    label: string;
    path: string;
    isLast: boolean;
};

function formatBreadcrumbLabel(segment: string): string {
    // Handle empty segments
    if (!segment) return "Dashboard";

    // Handle special cases
    if (segment.toLowerCase() === "dashboard") return "Dashboard";

    // Convert kebab/snake case to normal text
    const withoutDashes = segment.replace(/[-_]/g, " ");

    // Capitalize first letter of each word
    return withoutDashes
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
    // Remove trailing slash and split the path
    const paths = pathname.replace(/\/$/, "").split("/").filter(Boolean);

    // Always start with dashboard if we're in an authenticated route
    if (paths[0] !== "dashboard" && pathname !== "/") {
        paths.unshift("dashboard");
    }

    return paths.map((segment, index) => {
        const path = `/${paths.slice(0, index + 1).join("/")}`;
        return {
            label: formatBreadcrumbLabel(segment),
            path,
            isLast: index === paths.length - 1
        };
    });
}

export function ContentLayout() {
    const location = useLocation();
    const sidebar = useStore(useSidebarToggle, (state) => state);
    const breadcrumbs = useMemo(
        () => generateBreadcrumbs(location.pathname),
        [location.pathname]
    );

    return (
        <>
            <SidebarProvider>
                <MiniPlayer />
                <MuseSidebar />
                <main
                    className={cn(sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72", "flex-1 overflow-auto transition-all")}
                >
                    <Outlet />
                </main>
            </SidebarProvider>
        </>
    );
}