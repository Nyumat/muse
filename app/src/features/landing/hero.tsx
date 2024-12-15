import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PiSoundcloudLogoFill } from "react-icons/pi";
import { Link } from "react-router";

export const HeroSection: React.FC = () => {
    const { data: user } = useUser();

    const fadeIn = {
        hidden: { opacity: 0, y: 70 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.9,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="bg-background">
            <div className="place-items-center lg:max-w-screen-xl gap-8 mx-auto py-12 md:py-20">
                <div className="text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="text-sm py-2">
                            <span className="mr-2 text-primary">
                                <Badge>New</Badge>
                            </span>
                            <span>Muse now Supports SoundCloud!</span>
                            <PiSoundcloudLogoFill className="ml-2 w-6 h-6 text-primary" />
                        </Badge>
                    </motion.div>

                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="mx-auto text-center text-4xl md:text-5xl font-medium max-w-screen-lg"
                    >
                        <h1>Download and stream the<br />
                            <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                                songs and playlists
                            </span>
                            <br />
                            you love, for free.
                        </h1>
                    </motion.div>

                    <motion.p
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="md:max-w-screen-sm max-w-screen-sm px-4 mx-auto md:text-lg text-muted-foreground font-light"
                    >
                        Enjoy music the way it should be—offline, ad-free, and always free to use.
                        {/* Download your favorite songs, create playlists, and share them with your friends. */}
                    </motion.p>

                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4 md:space-y-0 md:space-x-4"
                    >
                        <Link
                            to={user ? "/dashboard" : "/login"}
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "w-5/6 md:w-1/4 font-bold group/arrow"
                            )}
                        >
                            Sign Up
                            <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
                        </Link>

                        <Button
                            asChild
                            variant="secondary"
                            className="w-5/6 md:w-1/4 font-bold"
                        >
                            <Link to="https://github.com/nyumat/muse" target="_blank">
                                Github repository
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative group mt-14"
                >
                    <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
                    <img
                        className="w-full md:w-[1200px] mx-auto rounded-lg relative rounded-lg leading-none flex items-center border border-t-2 border-secondary border-t-primary/30"
                        src={"/songs-preview.png"}
                        alt="dashboard"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
                </motion.div>
            </div>

            <div className="bg-background mt-12 py-12">

            </div>
        </section>
    );
};
