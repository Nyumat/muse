"use client";

import { Ellipsis, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getMenuList } from "./menu-list";
import { Link, useLocation, useNavigate, useResolvedPath } from "react-router";
import { CollapseMenuButton } from "@/components/ui/collapse-menu-btn";
import { toast } from "sonner";
import { useStore } from "@/hooks/use-store";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useAudioStore } from "@/stores/audioStore";


interface MenuProps {
    isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
    const pathname = useLocation().pathname;
    const menuList = getMenuList(pathname);
    const navigate = useNavigate();
    const sidebar = useStore(useSidebarToggle, (state) => state);
    const { currentSong } = useAudioStore();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        // settings.resetSettings();
        toast.success("Logged out successfully");
        navigate("/");
    };

    return (
        <ScrollArea className="[&>div>div[style]]:!block">
            <nav className="h-full w-full">
                <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
                    {menuList.map(({ groupLabel, menus }, index) => (
                        <li className={cn("w-full", groupLabel ? "pt-2" : "")} key={index}>
                            {(isOpen && groupLabel) || isOpen === undefined ? (
                                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                                    {groupLabel}
                                </p>
                            ) : !isOpen && isOpen !== undefined && groupLabel ? (
                                <TooltipProvider>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger className="w-full">
                                            <div className="flex w-full items-center justify-center">
                                                <Ellipsis className="h-5 w-5" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>{groupLabel}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <p className="pb-2"></p>
                            )}
                            {menus.map(
                                ({ href, label, icon: Icon, active, submenus }, index) =>
                                    submenus.length === 0 ? (
                                        <div className="w-full" key={index}>
                                            <TooltipProvider disableHoverableContent>
                                                <Tooltip delayDuration={100}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant={active ? "secondary" : "ghost"}
                                                            className="mb-1 h-10 w-full justify-start"
                                                            asChild
                                                        >
                                                            <Link to={href}>
                                                                <span
                                                                    className={cn(isOpen === false ? "" : "mr-4")}
                                                                >
                                                                    <Icon size={18} />
                                                                </span>
                                                                <p
                                                                    className={cn(
                                                                        "max-w-[200px] truncate",
                                                                        isOpen === false
                                                                            ? "-translate-x-96 opacity-0"
                                                                            : "translate-x-0 opacity-100",
                                                                    )}
                                                                >
                                                                    {label}
                                                                </p>
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    {isOpen === false && (
                                                        <TooltipContent side="right">
                                                            {label}
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ) : (
                                        <div className="w-full" key={index}>
                                            <CollapseMenuButton
                                                icon={Icon}
                                                label={label}
                                                active={active}
                                                submenus={submenus}
                                                isOpen={isOpen}
                                            />
                                        </div>
                                    ),
                            )}
                        </li>
                    ))}
                    <li className={cn("flex w-full grow items-end", { "pb-20": (sidebar?.isOpen), "pb-10": !sidebar?.isOpen, "pb-0": !currentSong, "pb-0 -translate-y-10": currentSong })}>
                        <TooltipProvider disableHoverableContent>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="mt-5 h-10 w-full justify-center"
                                    >
                                        <span className={cn(isOpen === false ? "" : "mr-4")}>
                                            <LogOut size={18} />
                                        </span>
                                        <p
                                            className={cn(
                                                "whitespace-nowrap",
                                                isOpen === false ? "hidden opacity-0" : "opacity-100",
                                            )}
                                        >
                                            Sign out
                                        </p>
                                    </Button>
                                </TooltipTrigger>
                                {isOpen === false && (
                                    <TooltipContent side="right"
                                    >Sign out</TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </li>
                </ul>
            </nav>
        </ScrollArea>
    );
}