import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Heart, Play, PlayCircle } from 'lucide-react'
import { Link, Route, Routes, useNavigate, useParams } from "react-router"
import { AuthLayout, LoginCard, RegisterCard } from "./components/auth"
import { HelpView } from "./features/help/view"
import { HeroSection } from "./features/landing/hero"
import { Navbar } from "./features/landing/nav"
import { Playlist, PlaylistViewNested } from "./features/playlists/nested"
import { PlaylistView } from "./features/playlists/view"
import { ProfileViewNested, UserProfile } from "./features/profile/nested"
import { ProfileView } from "./features/profile/view"
import { SettingsView } from "./features/settings/view"
import { SongsPage } from "./features/songs/dashboard/page"
import { Song } from './features/songs/dashboard/view'
import { SoundCloudSongsView } from "./features/songs/soundcloud/view"
import { YouTubeSongsView } from "./features/songs/youtube/view"
import { useSidebarToggle } from './hooks/use-sidebar-toggle'
import { useStore } from './hooks/use-store'
import { useUser } from './hooks/use-user'
import { ContentLayout } from "./layout/container"
import { DashboardPageLayout } from "./layout/page-layout"
import NotFoundPage from './layout/static/fourohfour'
import { SheetMenu } from './layout/static/muse-nav'
import Fetcher from "./lib/fetcher"
import { useAudioStore } from './stores/audioStore'


export default function App() {
    return (
        <div>
            <Navbar />
            <HeroSection />
        </div>
    );
}

function About() {
    return <h1>About</h1>;
}

function DashboardHome() {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink asChild>
                                    <Link to="/dashboard">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Home</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
        </>
    );
}

function PlaylistsPage() {
    return (
        <>
            <DashboardPageLayout
                breadcrumbs={
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Playlists</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                }
            >
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold dark:text-gray-200 text-gray-700">
                        Your Playlists
                    </h1>
                </div>
                <PlaylistView />
            </DashboardPageLayout>
        </>
    );
}

function ProfilePage() {
    return (
        <>
            <DashboardPageLayout
                breadcrumbs={
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Profile</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                }
            >
                <ProfileView />
            </DashboardPageLayout>
        </>
    );
}

function SinglePlaylistPage() {
    const { id } = useParams<{ id: string }>();
    const api = Fetcher.getInstance();
    const { data: playlist } = useQuery({
        queryKey: ["playlist", id],
        queryFn: async () => {
            const { data } = await api.get<Playlist>(`/api/playlists/${id}`);
            return data;
        },
    });
    return (
        <>
            <DashboardPageLayout
                breadcrumbs={
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard/playlists">Playlists</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{playlist?.name ?? "Playlist"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                }
            >
                <PlaylistViewNested />
            </DashboardPageLayout>
        </>
    );
}

function ProfilePageForUser() {
    const api = Fetcher.getInstance();
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading } = useQuery({
        queryKey: ["user-profile", id],
        queryFn: async () => {
            const { data } = await api.get<UserProfile>(`/users/${id}`);
            return data;
        },
    });
    return (
        <>
            <DashboardPageLayout
                breadcrumbs={
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard/profile">Profile</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {isLoading ? "Loading..." : `${user?.username}`}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                }
            >
                <ProfileViewNested userData={user} isLoading={isLoading} />
            </DashboardPageLayout>
        </>
    );
}

function HelpPage() {
    return (
        <>
            <DashboardPageLayout
                breadcrumbs={
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Help</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                }
            >
                <HelpView />
            </DashboardPageLayout>
        </>
    );
}

function SettingsPage() {
    return (
        <>
            <DashboardPageLayout
                breadcrumbs={
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                }
            >
                <SettingsView />
            </DashboardPageLayout>
        </>
    );
}


export function MuseRouting() {
    return (
        <Routes>
            <Route index element={<App />} />
            <Route path="about" element={<About />} />
            <Route element={<AuthLayout />}>
                <Route path="login" element={<LoginCard />} />
                <Route path="register" element={<RegisterCard />} />
            </Route>
            <Route path="/dashboard" element={<ContentLayout />}>
                <Route index element={<StubDashboardHome />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="songs" element={<SongsPage />} />
                <>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="profile/:id" element={<ProfilePageForUser />} />
                </>
                <>
                    <Route path="playlists" element={<PlaylistsPage />} />
                    <Route path="playlists/:id" element={<SinglePlaylistPage />} />
                </>
                <Route path="settings" element={<SettingsPage />} />
                <Route path="songs/youtube" element={<YouTubeSongsView />} />
                <Route path="songs/soundcloud" element={<SoundCloudSongsView />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export type RecentlyDownloaded = {
    title: string;
    thumbnail: string;
    stream_url: string;
    uploader: string;
    _id: string;
}

function StubDashboardHome() {
    const navigate = useNavigate();
    const sidebar = useStore(useSidebarToggle, (state) => state);
    const user = useUser();
    const queryClient = useQueryClient();
    const { initializeAudio } = useAudioStore()

    const { data: museStats } = useQuery({
        queryKey: ["muse-stats"],
        queryFn: async () => {
            const { data } = await Fetcher.getInstance().get("/users/data/stats");
            return data;
        },
    });

    const { data: mostPlayedPlaylists } = useQuery({
        queryKey: ["most-played-playlists"],
        queryFn: async () => {
            const { data } = await Fetcher.getInstance().get(`/api/playlists/${user?.data?._id}/most-played`);
            return data;
        },
    });

    const { data: recentlyDownloaded } = useQuery({
        queryKey: ["recently-downloaded"],
        queryFn: async () => {
            const { data } = await Fetcher.getInstance().get("/api/songs/downloads/recent");
            return data;
        }
    });

    const getMessage = () => {
        const date = new Date();
        const hours = date.getHours();
        if (hours < 12) return "Good Morning";
        if (hours < 18) return "Good Afternoon";
        if (hours < 21) return "Good Evening";
        return "Good Night";
    }

    const favoriteTracks: Song[] = []

    const mutation = useMutation({
        mutationFn: async (playlistId: string) => {
            const playlist = mostPlayedPlaylists?.find((playlist: Playlist) => playlist._id === playlistId);
            if (playlist) {
                await initializeAudio(playlist.songs, 0, playlist);
            } else {
                throw new Error("Playlist not found");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["most-played-playlists"] });
        },
        onError: (error) => {
            console.error("Error initializing playlist:", error);
        }
    });

    if (!sidebar) return null;
    return (
        <>
            <div className="flex flex-col min-h-screen bg-background">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-2 px-4">
                        <SheetMenu />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink asChild>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Home</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-4 space-y-6"> {/* TODO: Maybe add container or max-w? */}
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                            {getMessage()},{" "}
                            {user?.data?.username}.</h1>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card className='bg-secondary'>
                                <CardHeader>
                                    <CardTitle>Recent Downloads</CardTitle>
                                    <CardDescription>Your latest downloaded tracks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {recentlyDownloaded?.map((track: RecentlyDownloaded, index: number) => (
                                            <li key={index} className="flex items-center space-x-3">
                                                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                                    <img src={track.thumbnail} alt={track.title} className='object-cover w-full h-full' />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate">{track.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{track.uploader}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => initializeAudio([...recentlyDownloaded], index)}>
                                                    <PlayCircle className="h-5 w-5" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card className='bg-secondary'>
                                <CardHeader>
                                    <CardTitle>Popular Playlists</CardTitle>
                                    <CardDescription>Your most played collections</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                        {mostPlayedPlaylists?.map((playlist: Playlist, index: number) => (
                                            <li key={index} className="flex items-center space-x-3">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                                    <img src={playlist.coverImage ?? "/default-cover.svg"} alt={playlist.name} className='object-cover w-full h-full' />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{playlist.name}</p>
                                                    <p className="text-sm text-muted-foreground">{playlist.playCount} plays</p>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => mutation.mutate(playlist._id)}>
                                                    <PlayCircle className="h-5 w-5" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-secondary">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                            Favorites
                                        </CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            Your most loved tracks
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/favorites")}>
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2">
                                        {favoriteTracks?.map((track, index) => (
                                            <div
                                                key={index}
                                                className="group relative flex items-center gap-4 rounded-lg border p-3 hover:bg-accent transition-colors"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={track.thumbnail}
                                                        alt={track.title}
                                                        className="h-12 w-12 rounded-md object-cover"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => initializeAudio([...favoriteTracks], index)}
                                                    >
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex-1 space-y-0.5 min-w-0">
                                                    <p className="font-medium leading-none truncate">
                                                        {track.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {track.uploader}
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // setFavoriteTracks((prev) => prev.map((t) => t.title === track.title ? { ...t, isFavorited: !t.isFavorited } : t))
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Heart
                                                        // className={`h-4 w-4 ${track.isFavorited ? "fill-red-500 text-red-500" : ""}`}
                                                    />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="w-full bg-secondary">
                                <CardHeader>
                                    <CardTitle>Statistics</CardTitle>
                                    <CardDescription>Your music in numbers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <dl className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-primary/10 p-4 rounded-lg">
                                            <dt className="font-medium text-primary">Total Downloads</dt>
                                            <dd className="text-3xl font-bold mt-2">{museStats?.totalDownloads}</dd>
                                        </div>
                                        <div className="bg-primary/10 p-4 rounded-lg">
                                            <dt className="font-medium text-primary">Playlists Created</dt>
                                            <dd className="text-3xl font-bold mt-2">{museStats?.totalPlaylists}</dd>
                                        </div>
                                        <div className="bg-primary/10 p-4 rounded-lg">
                                            <dt className="font-medium text-primary">Storage Used</dt>
                                            <dd className="text-3xl font-bold mt-2">{museStats?.storageUsed} MB</dd>
                                        </div>
                                        <div className="bg-primary/10 p-4 rounded-lg">
                                            <dt className="font-medium text-primary">Listening Time</dt>
                                            <dd className="text-3xl font-bold mt-2">{museStats?.totalListeningTime} hours</dd>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
