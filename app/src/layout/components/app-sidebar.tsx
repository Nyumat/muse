import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import {
    AudioLines,
    ChevronLeft,
    ChevronRight,
    ListMusic,
    MoreHorizontal,
    MusicIcon,
    Share,
    Trash2,
    type LucideIcon
} from "lucide-react";
import * as React from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { IconType } from "react-icons/lib";
import { PiMusicNoteDuotone, PiMusicNoteSimpleDuotone, PiSoundcloudLogoDuotone } from "react-icons/pi";
import { Link } from "react-router";
import { Menu } from "../static/menu";
import { NavUser } from "./nav-user";

const sideBarNavList = {
    mainNav: [
        {
            name: "Songs",
            url: "/dashboard/songs",
            icon: AudioLines,
        },
        {
            name: "Playlists",
            url: "/dashboard/playlists",
            icon: ListMusic,
        },
        // {
        //   name: "Analytics",
        //   url: "/dashboard/analytics", // TODO: Add analytics page
        //   icon: ChartNoAxesColumn,
        // },
        {
            name: "YouTube",
            url: "/dashboard/songs/youtube",
            icon: AiOutlineYoutube,
        },
        {
            name: "SoundCloud",
            url: "/dashboard/songs/soundcloud",
            icon: PiSoundcloudLogoDuotone,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isLoading, data: user } = useUser();

    if (isLoading) {
        return (
            <>
                <div className="w-screen flex h-screen justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sidebar-primary"></div>
                </div>
            </>
        );
    }

    return (
        <Sidebar
            variant="inset"
            {...props}
            className=" backdrop-blur-xs bg-sidebar-primary w-52"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/" title="Muse Logo">
                                <div className="flex aspect-auto size-24 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <PiMusicNoteSimpleDuotone className="h-8 w-8" />
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <MainNavSection items={sideBarNavList.mainNav} />
                <NavMain
                    items={[
                        {
                            title: "Muse",
                            url: "/dashboard",
                            icon: PiMusicNoteDuotone,
                            isActive: true,
                            items: [
                                {
                                    title: "Help",
                                    url: "/dashboard/help",
                                },
                                {
                                    title: "Settings",
                                    url: "/dashboard/settings",
                                },
                                {
                                    title: "Profile",
                                    url: "/dashboard/profile",
                                },
                            ],
                        },
                    ]}
                />
            </SidebarContent>
            <SidebarFooter>
                {/* Kinda Hacky, but whatever...for now... */}
                {user && (
                    <NavUser
                        _id={user._id}
                        name={user.name}
                        email={user.email}
                        username={user.username}
                        pfp={user.pfp}
                    />
                )}
            </SidebarFooter>
        </Sidebar>
    );
}

export function MainNavSection({
    items,
}: {
    items: {
        name: string;
        url: string;
        icon: LucideIcon | IconType;
    }[];
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel title="Dashboard">Muse Dashboard</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link to={item.url} aria-label={item.name} title={item.name}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="hidden">
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <Share className="text-muted-foreground" />
                                    <span>Download All</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Trash2 className="text-muted-foreground" />
                                    <span>Delete Item</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                {/* <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon | IconType;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>More</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <Link to={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                            {item.items?.length ? (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                                            <ChevronRight />
                                            <span className="sr-only">Toggle</span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link to={subItem.url}>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            ) : null}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
    }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild size="sm">
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

interface SidebarToggleProps {
    isOpen: boolean | undefined;
    setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
    return (
        <div className="invisible absolute -right-[16px] top-[12px] z-20 lg:visible">
            <Button
                onClick={() => setIsOpen?.()}
                className="h-8 w-8 rounded-md"
                variant="outline"
                size="icon"
            >
                <ChevronLeft
                    className={cn(
                        "h-4 w-4 transition-transform duration-700 ease-in-out",
                        isOpen === false ? "rotate-180" : "rotate-0",
                    )}
                />
            </Button>
        </div>
    );
}

export function MuseSidebar() {
    const sidebar = useStore(useSidebarToggle, (state) => state);
    if (!sidebar) return null;
    return (
        <aside
            className={cn(
                "bg-background fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
                sidebar?.isOpen === false ? "w-[90px]" : "w-72",
            )}
        >
            <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
                <Button
                    className={cn(
                        "mb-1 transition-transform duration-300 ease-in-out",
                        sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0",
                    )}
                    variant="link"
                    asChild
                >
                    <Link to="/" className="flex items-center gap-2">
                        <MusicIcon size={32} />
                        <h1
                            className={cn(
                                "font-bold text-lg text-primary",
                                sidebar?.isOpen === false ? "hidden" : "block",
                            )}
                        >
                            ohits.fun
                        </h1>
                    </Link>
                </Button>
                <Menu isOpen={sidebar?.isOpen} />
            </div>
        </aside>
    );
}