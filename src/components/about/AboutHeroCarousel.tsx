"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Pause, Film } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface MediaItem {
    src: string;
    label: string;
    alt: string;
    isVideo?: boolean;
}

const photos: MediaItem[] = [
    { src: "/album/12-hub-video-highlight.mp4", label: "Hub build motion clip", alt: "Video highlight of hub assembly", isVideo: true },
    { src: "/album/02-ground-foundation.jpeg", label: "Site groundwork and foundation", alt: "Raw shipping container placed on concrete foundation" },
    { src: "/album/03-window-framing.jpeg", label: "Structural cutouts and welding", alt: "Cutting window openings and welding steel door frames" },
    { src: "/album/04-solar-canopy.jpeg", label: "Solar roof canopy framing", alt: "Mounting overhead roof structure for solar panels" },
    { src: "/album/05-rooftop-solar.jpeg", label: "Solar panel array mounting", alt: "Rooftop solar panel array installation" },
    { src: "/album/06-bare-interior-wood.jpeg", label: "Interior insulation and wood paneling", alt: "Bare timber wall paneling and carpenter tools inside container" },
    { src: "/album/08-starlink-unboxing.jpeg", label: "Starlink hardware unboxing", alt: "Unboxing Starlink satellite dish hardware" },
    { src: "/album/09-starlink-mounted.jpeg", label: "High-speed satellite antenna", alt: "Starlink dish installed on container roof" },
    { src: "/album/01-izzy-memorial.jpeg", label: "Founder legacy — in loving memory", alt: "Memorial resting place of TAS Founder Obi Izzy Onwuzurike" },
    { src: "/album/11-izzy-framed-portrait.jpeg", label: "Founder's portrait", alt: "Framed portrait of Founder Obi Izzy Onwuzurike mounted on the interior wall" },
    // { src: "/album/13-hub-tour.mp4", label: "13. Hub Walkthrough Motion Clip", alt: "Video walkthrough of hub interior", isVideo: true },
    { src: "/album/14-completed-exterior.jpeg", label: "Finished TAS solar hub", alt: "Completed green solar-powered TAS container hub at golden hour" },
    { src: "/album/15-active-workspace.jpeg", label: "Active community workspace", alt: "Students and builders working at laptop stations inside active hub" },
    { src: "/album/16-community-launch.jpeg", label: "Community launch celebration", alt: "Community group photo celebrating launch outside TAS hub" },
];

const AUTOPLAY_INTERVAL_MS = 5000; // 5 seconds per slide once manually enabled

export default function AboutHeroCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoplayActive, setIsAutoplayActive] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        if (isAutoplayActive) {
            intervalRef.current = setInterval(() => {
                setActiveIndex((current) => (current + 1) % photos.length);
            }, AUTOPLAY_INTERVAL_MS);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isAutoplayActive]);

    // Smoothly scroll active thumbnail into view
    useEffect(() => {
        if (thumbnailRefs.current[activeIndex]) {
            thumbnailRefs.current[activeIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    }, [activeIndex]);

    const handlePrevious = () => {
        setActiveIndex((current) => (current - 1 + photos.length) % photos.length);
    };

    const handleNext = () => {
        setActiveIndex((current) => (current + 1) % photos.length);
    };

    const handleSelectIndex = (index: number) => {
        setActiveIndex(index);
    };

    const toggleManualAutoplay = () => {
        setIsAutoplayActive((prev) => !prev);
    };

    const currentMedia = photos[activeIndex];

    return (
        <div className="min-w-0 w-full max-w-full" aria-roledescription="carousel" aria-label="TAS Hub journey, construction, and launch story">
            <div className="relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-feature bg-dark/95 shadow-xl">
                {currentMedia.isVideo ? (
                    <video
                        key={currentMedia.src}
                        src={currentMedia.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-label={currentMedia.alt}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Image
                        key={currentMedia.src}
                        src={currentMedia.src}
                        alt={currentMedia.alt}
                        fill
                        priority
                        sizes="(min-width: 1024px) 520px, 100%"
                        className="object-cover transition-opacity duration-300"
                    />
                )}

                <div className="absolute left-5 top-5 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleManualAutoplay}
                        aria-label={isAutoplayActive ? "Pause slideshow" : "Start slideshow"}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-dark/80 text-white backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        {isAutoplayActive ? (
                            <Pause className="h-4 w-4 text-secondary" />
                        ) : (
                            <Play className="h-4 w-4 ml-0.5 text-secondary" />
                        )}
                    </button>
                </div>

                <span className="absolute right-5 top-5 rounded-full bg-white/90 px-3.5 py-1.5 font-body text-xs font-bold text-dark shadow-sm">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </span>

                <div className="absolute bottom-4 left-4 right-4 flex min-w-0 items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            aria-label="Show previous media item"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-dark shadow-md transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Show next media item"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-dark shadow-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <span className="min-w-0 truncate rounded-full bg-dark/85 px-4 py-2 font-body text-xs font-semibold text-white backdrop-blur-md">
                        {currentMedia.label}
                    </span>
                </div>
            </div>

            {/* Single horizontal straight line thumbnail strip bounded within main frame width with soft edge shadows */}
            <div className="relative mt-4 w-full overflow-hidden before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:top-0 before:z-10 before:w-8 before:bg-gradient-to-r before:from-tas-sky before:to-transparent after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:top-0 after:z-10 after:w-10 after:bg-gradient-to-l after:from-tas-sky after:to-transparent">
                <div className="flex w-full max-w-full items-center gap-2 overflow-x-auto overscroll-x-contain px-1 py-1.5 scrollbar-none snap-x focus-visible:outline-none">
                    {photos.map((photo, index) => (
                        <button
                            key={photo.src}
                            ref={(el) => {
                                thumbnailRefs.current[index] = el;
                            }}
                            type="button"
                            onClick={() => handleSelectIndex(index)}
                            aria-label={`Show ${photo.label}`}
                            aria-current={index === activeIndex ? "true" : undefined}
                            className={`relative h-12 w-12 shrink-0 sm:h-10 sm:w-8 aspect-square overflow-hidden rounded-xl border-2 transition-all snap-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                                index === activeIndex ? "border-primary opacity-100 scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                        >
                            {photo.isVideo ? (
                                <div className="relative h-full w-full bg-dark">
                                    <video src={photo.src} muted playsInline className="h-full w-full object-cover" />
                                    <span className="absolute inset-0 flex items-center justify-center bg-dark/40 text-secondary">
                                        <Film className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                            ) : (
                                <Image src={photo.src} alt="" fill sizes="56px" className="object-cover" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
