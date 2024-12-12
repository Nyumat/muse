const extractor = [
    { logo: 'youtube', name: 'YouTube' },
    { logo: 'soundcloud', name: 'SoundCloud' },
    { logo: 'spotify', name: 'Spotify' },
]

export function Extractors() {
    const matchExtractors = (extractor: string) => {
        switch (extractor) {
            case 'youtube':
                return '/logos/youtube.png';
            case 'soundcloud':
                return '/logos/soundcloud.svg';
            case 'spotify':
                return '/logos/spotify.png';
            default:
                return 'Unknown';
        }
    }
    return (
        <section id="press">
            <div className="py-14">
                <div className="container mx-auto px-4 md:px-8">
                    <h3 className="text-center text-3xl font-semibold">
                        With selections from all the <br /> existing platforms <span className="line-through">you hate</span> you love.
                    </h3>
                    <div className="relative mt-6">
                        <div className="grid grid-cols-2 place-items-center gap-2 md:gap-4 lg:grid-cols-4 xl:gap-x-6 2xl:grid-cols-8">
                            {extractor.map(({ logo, name }) => (
                                <img
                                    key={name}
                                    src={matchExtractors(logo)}
                                    title={name}
                                    aria-label={name}
                                    className="h-auto w-auto px-2 dark:brightness-0 dark:invert"
                                    alt={`logo-${name}`}
                                />
                            ))}
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
