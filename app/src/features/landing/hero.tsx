import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { PiSoundcloudLogoFill } from "react-icons/pi";
import { Link } from "react-router";

export const HeroSection = () => {
  const { theme } = useTheme();
  const { data: user } = useUser();
  return (
    <section className="bg-background">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-12 md:py-20">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> Muse now Supports SondCloud!</span>
            <PiSoundcloudLogoFill className="ml-2 w-6 h-6 text-primary" />
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Discover
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                Endless Tunes
              </span>
              for
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                Every Mood
              </span>
            </h1>
          </div>

          <p className="md:max-w-screen-sm max-w-screen-sm px-4 mx-auto md:text-xl text-muted-foreground">
            {`
            The next-generation music streaming platform for listening to your favorite songs, discovering new music, and creating your own playlists.
            `}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link
              to={user ? "/dashboard" : "/login"}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-5/6 md:w-1/4 font-bold group/arrow"
              )}
            >
              Get Started
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Link>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link to="https://github.com/nyumat/muse" target="_blank">
                Github respository
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <img
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src={
              theme === "light"
                ? "/hero-image-light.jpeg"
                : "/hero-image-dark.jpeg"
            }
            alt="dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
