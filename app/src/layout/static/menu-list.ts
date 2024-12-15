import {
    Heart,
    HelpCircle,
    LayoutDashboardIcon,
    LayoutGrid,
    LockIcon,
    LucideIcon,
    Settings2Icon,
    User2,
    UserCog
} from "lucide-react";
import { IconType } from "react-icons/lib";
import { PiList, PiMusicNote, PiPlaylist, PiSoundcloudLogo, PiYoutubeLogoLight } from "react-icons/pi";

export type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon?: LucideIcon | IconType | undefined | Element;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon | IconType | undefined | Element;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Home",
                    active: pathname === "/dashboard",
                    icon: LayoutGrid,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Your Catalog",
            menus: [
                {
                    href: "/songs",
                    label: "Songs",
                    active: false,
                    icon: PiMusicNote,
                    submenus: [
                        {
                            href: "/dashboard/songs",
                            label: "All Songs",
                            icon: PiList,
                            active: pathname === "/dashboard/songs" && !pathname.includes("/youtube") && !pathname.includes("/soundcloud"),
                        },
                        {
                            href: "/dashboard/songs/youtube",
                            label: "YouTube",
                            icon: PiYoutubeLogoLight,
                            active: pathname === "/dashboard/songs/youtube",
                        },
                        {
                            href: "/dashboard/songs/soundcloud",
                            label: "SoundCloud",
                            icon: PiSoundcloudLogo,
                            active: pathname === "/dashboard/songs/soundcloud",
                        },
                    ],
                },
                {
                    href: "/dashboard/playlists",
                    label: "Playlists",
                    active: pathname.includes("/playlists"),
                    icon: PiPlaylist,
                    submenus: [],
                },
                {
                    href: "/dashboard/favorites",
                    label: "Favorites",
                    active: pathname.includes("/favorites"),
                    icon: Heart,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Account",
            menus: [
                {
                    href: "/dashboard/settings",
                    label: "Settings",
                    active: false,
                    icon: Settings2Icon,
                    submenus: [
                        {
                            href: "/dashboard/settings/account",
                            label: "Account",
                            icon: User2,
                            active: pathname.includes("/account"),
                        },
                        {
                            href: "/dashboard/settings/privacy",
                            label: "Privacy",
                            icon: LockIcon,
                            active: pathname.includes("/privacy"),
                        },
                        {
                            href: "/dashboard/settings/preferences",
                            label: "Preferences",
                            icon: LayoutDashboardIcon,
                            active: pathname.includes("/preferences"),
                        },
                    ],
                },
                {
                    href: "/dashboard/profile",
                    label: "Profile",
                    active: pathname.includes("/profile"),
                    icon: UserCog,
                    submenus: [],
                },
                {
                    href: "/dashboard/help",
                    label: "Need Help?",
                    active: pathname.includes("/help"),
                    icon: HelpCircle,
                    submenus: [
                    ],
                },
            ],
        },
    ];
}