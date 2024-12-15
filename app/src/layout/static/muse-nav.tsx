
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutGrid, LogOut, MenuIcon, MusicIcon, User } from "lucide-react";
import { Suspense } from "react";
import { Link, useNavigate } from "react-router";
import { Menu } from "./menu";
import { cn } from "@/lib/utils";

export function SheetMenu() {
    return (
        <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
                <Button className={cn("h-8 bg-primary/50 backdrop-blur-xl")} variant="ghost" size="icon">
                    <MenuIcon size={12} />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
                <SheetHeader>
                    <Button
                        className="flex items-center justify-center pt-6"
                        variant="link"
                        asChild
                    >
                        <Link to="/" className="flex items-center gap-2">
                            <MusicIcon size={24} />
                            <SheetTitle className="text-lg font-bold text-primary">
                               ohits.fun
                            </SheetTitle>
                        </Link>
                    </Button>
                </SheetHeader>
                <Menu isOpen />
            </SheetContent>
        </Sheet>
    );
}

interface NavbarProps {
    title: string;
}

export function MuseNavbar({ title }: NavbarProps) {
    return (
        <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
            <div className="mx-4 flex h-14 items-center sm:mx-8">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <SheetMenu />
                    <h1 className="font-bold">{title}</h1>
                </div>
                <div className="flex flex-1 items-center justify-end gap-2">
                    <UserNav />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}

export function UserNav() {
    const navigate = useNavigate();
    const me = {
        name: "John Doe",
        email: "tom@gmail.com",
        image: "https://randomuser.me/api/portraits",
    };

    return (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="relative h-8 w-8 rounded-full"
                            >
                                <>
                                    <Suspense
                                        fallback={
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="" alt="" />
                                            </Avatar>
                                        }>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={me?.image ?? ""} alt={me?.name ?? ""} />

                                        </Avatar>
                                    </Suspense>
                                </>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Profile</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{me?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {me?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link to="/dashboard" className="flex items-center">
                            <LayoutGrid className="mr-3 h-4 w-4 text-muted-foreground" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link to="/account" className="flex items-center">
                            <User className="mr-3 h-4 w-4 text-muted-foreground" onClick={() => navigate("/account")} />
                            Account
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer" onClick={() => navigate("/login")}>
                    <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    );
}