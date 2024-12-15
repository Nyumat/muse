import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFoundPage() {
    const { theme } = useTheme();
    const resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    const resolvedTheme = theme || resolved;

    const BG_URL =
        resolvedTheme === "dark"
            ? "https://4kwallpapers.com/images/walls/thumbs_3t/10781.png"
            : "https://4kwallpapers.com/images/walls/thumbs_3t/19801.jpg";

    return (
              <div className="relative min-h-screen">
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat bg-blend-darken filter blur-sm"
                style={{
                    backgroundImage:
                        resolvedTheme === "light"
                            ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)), url('${BG_URL}')`
                            : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${BG_URL}')`,
                    zIndex: -1,
                }}
            ></div>
            <div className="relative flex min-h-screen items-center justify-center">
                <div className="mx-auto max-w-xl px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                        We can't find that page.
                    </h1>

                    <p className="mt-4 text-gray-200">
                        Try searching again, or return home to start from the beginning.
                    </p>

                    <Button asChild variant="secondary" size="lg" className="mt-6">
                        <Link to="/dashboard">Go Back Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}