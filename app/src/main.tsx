import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { MuseRouting } from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

const queryClient = new QueryClient();

export const BG_URL =
  localStorage.getItem("vite-ui-theme") === "dark"
    ? `https://4kwallpapers.com/images/walls/thumbs_3t/19801.jpg`
    : `https://4kwallpapers.com/images/walls/thumbs_3t/10781.png`;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <MuseRouting />
      </QueryClientProvider>
    </ThemeProvider>
    <Toaster richColors closeButton position="bottom-center" />
  </BrowserRouter>
);
