import { useQuery } from "@tanstack/react-query";
import { Link, Route, Routes, useParams } from "react-router";
import { AuthLayout, LoginCard, RegisterCard } from "./components/auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { Separator } from "./components/ui/separator";
import { SidebarTrigger } from "./components/ui/sidebar";
import { HelpView } from "./features/help/view";
import { HeroSection } from "./features/landing/hero";
import { Navbar } from "./features/landing/nav";
import { ProfileViewNested, UserProfile } from "./features/profile/nested";
import { ProfileView } from "./features/profile/view";
import { SettingsView } from "./features/settings/view";
import { SongsPage } from "./features/songs/dashboard/page";
import { DashboardPageLayout } from "./layout/page-layout";
import { DashboardLayout } from "./layout/skeleton";
import Fetcher from "./lib/fetcher";

export default function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
    </>
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

function SoundCloudSongs() {
  return (
    <>
      <DashboardPageLayout
        breadcrumbs={
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to="/dashboard/songs">Songs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>SoundCloud</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        }
      >
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold dark:text-gray-200 text-gray-700">
            SoundCloud
          </h1>
        </div>
      </DashboardPageLayout>
    </>
  );
}

function YouTubeSongs() {
  return (
    <>
      <DashboardPageLayout
        breadcrumbs={
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to="/dashboard/songs">Songs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>YouTube</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        }
      >
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold dark:text-gray-200 text-gray-700">
            YouTube
          </h1>
        </div>
      </DashboardPageLayout>
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
            Playlists
          </h1>
        </div>
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

function AnalyticsPage() {
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
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        }
      >
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold dark:text-gray-200 text-gray-700">
            Analytics
          </h1>
        </div>
      </DashboardPageLayout>
    </>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1>404 Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
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
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="songs" element={<SongsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:id" element={<ProfilePageForUser />} />
        <Route path="playlists" element={<PlaylistsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="songs/youtube" element={<YouTubeSongs />} />
        <Route path="songs/soundcloud" element={<SoundCloudSongs />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}