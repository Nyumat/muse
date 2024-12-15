import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { MuseRouting } from "./App.tsx";
import { MiniPlayer } from "./components/mini-player.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
            <QueryClientProvider client={queryClient}>
                <MuseRouting />
            </QueryClientProvider>
        </ThemeProvider>
        <Toaster richColors closeButton position="bottom-center" />
    </BrowserRouter>
);
