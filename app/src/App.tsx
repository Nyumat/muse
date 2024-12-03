import { Link, Route, Routes } from "react-router";
import { AuthLayout, LoginCard, RegisterCard } from "./components/auth";
import { ModeToggle } from "./components/mode-toggle";
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
import { SongsPage } from "./features/songs/dashboard/page";
import { DashboardPageLayout } from "./layout/page-layout";
import { DashboardLayout } from "./layout/skeleton";

export default function App() {
  return (
    <div>
      <ModeToggle />
      <h1 className="text-4xl font-bold text-center dark:text-red-800 text-blue-500">
        Hello, world!
      </h1>
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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
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
              <BreadcrumbLink href="/dashboard/songs">Songs</BreadcrumbLink>
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
              <BreadcrumbLink href="/dashboard/songs">Songs</BreadcrumbLink>
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
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
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

function AnalyticsPage() {
  return (
    <>
      <DashboardPageLayout
        breadcrumbs={
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
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
        <Route path="songs" element={<SongsPage />} />
        <Route path="playlists" element={<PlaylistsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="songs/youtube" element={<YouTubeSongs />} />

        <Route path="songs/soundcloud" element={<SoundCloudSongs />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
