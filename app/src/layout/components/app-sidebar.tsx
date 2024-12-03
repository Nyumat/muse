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
import { useUser } from "@/hooks/use-user";
import {
  AudioLines,
  ChartNoAxesColumn,
  ChevronRight,
  Folder,
  ListMusic,
  MoreHorizontal,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { IconType } from "react-icons/lib";
import { PiSoundcloudLogoDuotone } from "react-icons/pi";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
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
    {
      name: "Analytics",
      url: "/dashboard/analytics",
      icon: ChartNoAxesColumn,
    },
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
  const { isLoading, user, error } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      toast.error("Your session has expired. Please log in again.");
      navigate("/login");
    }

    if (error) {
      toast.error(error.message);
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error]);

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
      className=" backdrop-blur-xs shadow-xl bg-sidebar-primary w-52"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" title="Muse Logo">
                <div className="flex aspect-auto size-24 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <img src="/logo.svg" alt="logo" className="dark:hidden" />
                    <img
                      src="/logo-color.svg"
                      alt="muse logo"
                      className="hidden dark:block"
                    />
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <MainNavSection items={sideBarNavList.mainNav} />
      </SidebarContent>
      <SidebarFooter>
        {/* Kinda Hacky, but whatever...for now... */}
        {user && (
          <NavUser
            _id={user._id}
            name={user.name}
            email={user.email}
            username={user.username}
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
              <DropdownMenuTrigger asChild>
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
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
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
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
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
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
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
