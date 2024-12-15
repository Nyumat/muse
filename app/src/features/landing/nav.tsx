import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { Github, Menu } from "lucide-react";
import React from "react";
import { Link } from "react-router";

interface RouteProps {
    href: string;
    label: string;
}

const routeList: RouteProps[] = [
    {
        href: import.meta.env.DEV ? "http://localhost:3000" : "https://museisfun.fly.dev",
        label: "API Docs"
    },
    {
        href: "#faq",
        label: "FAQ",
    },
    {
        href: "/login",
        label: "Login",
    },
    {
        href: "/register",
        label: "Register",
    },
    {
        href: "/dashboard",
        label: "Dashboard",
    },
];

export const Navbar = () => {
    const { data: user } = useUser();
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <header className="shadow-inner bg-opacity-5 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 backdrop-blur-sm max-h-12">
            <Link to="/" title="Muse Logo">
                <div className="flex aspect-auto size-20 items-center justify-center rounded-lg hover:bg-sidebar-primary-hover transition-colors">
                    <div className="text-left text-sm leading-tight">
                        <img
                            src="/logo.svg"
                            alt="logo"
                            className="dark:hidden w-full h-full object-contain"
                        />
                        <img
                            src="/logo-color.svg"
                            alt="muse logo"
                            className="hidden dark:block w-full h-full object-contain"
                        />
                    </div>
                </div>
            </Link>
            {/* <!-- Mobile --> */}
            <div className="flex items-center lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Menu
                            onClick={() => setIsOpen(!isOpen)}
                            className="cursor-pointer lg:hidden"
                        />
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
                    >
                        <div>
                            <SheetHeader className="mb-4 ml-4">
                                <SheetTitle className="flex items-center">
                                    <Link to="/" className="flex items-center">
                                        <img src="/logo.svg" alt="logo" className="dark:hidden w-1/2" />
                                        <img
                                            src="/logo-color.svg"
                                            alt="muse logo"
                                            className="hidden dark:block w-1/2"
                                        />
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-2">
                                {routeList.map(({ href, label }) => {
                                    if (!user && label === "Dashboard") return null;
                                    if (user && (label === "Login" || label === "Register"))
                                        return null;
                                    return (
                                        <Button
                                            key={href}
                                            onClick={() => setIsOpen(false)}
                                            asChild
                                            variant="ghost"
                                            className={cn("justify-start text-base")}
                                        >
                                            <Link to={href}>{label}</Link>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                            <Separator className="mb-2" />

                            <ModeToggle />
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {/* <!-- Desktop --> */}
            <NavigationMenu className="hidden lg:block mx-auto">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        {routeList.map(({ href, label }) => {
                            if (!user && label === "Dashboard") return null;
                            if (user && (label === "Login" || label === "Register"))
                                return null;

                            return (
                                <NavigationMenuLink key={href} asChild>
                                    <Link to={href} className="text-base px-2">
                                        {label}
                                    </Link>
                                </NavigationMenuLink>
                            );
                        })}
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="hidden lg:flex">
                <ModeToggle />

                <Button asChild size="sm" variant="ghost" aria-label="View on GitHub">
                    <Link
                        aria-label="View on GitHub"
                        to="https://github.com/nyumat/muse"
                        target="_blank"
                    >
                        <Github className="size-5" />
                    </Link>
                </Button>
            </div>
        </header>
    );
};
