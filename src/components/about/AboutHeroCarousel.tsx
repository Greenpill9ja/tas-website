"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const photos = [
    { src: "/Akwahub.png", alt: "The active Tech and Sun hub in Awka" },
    { src: "/tas hub.jpeg", alt: "A solar-powered Tech and Sun hub concept" },
    { src: "/enuguhub.png", alt: "The planned Tech and Sun hub location in Enugu" },
];

export default function AboutHeroCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const showPrevious = () => setActiveIndex((current) => (current - 1 + photos.length) % photos.length);
    const showNext = () => setActiveIndex((current) => (current + 1) % photos.length);

    return (
        <div className="w-full" aria-roledescription="carousel" aria-label="Tech and Sun hub photographs">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-xl">
                <Image
                    key={photos[activeIndex].src}
                    src={photos[activeIndex].src}
                    alt={photos[activeIndex].alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 520px, 100%"
                    className="object-cover"
                />
                <span className="absolute right-5 top-5 rounded-full bg-dark/80 px-3 py-2 font-body text-xs font-bold text-white">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </span>
            </div>

            <div className="mt-4 flex justify-center">
                <div className="flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={showPrevious}
                        aria-label="Show previous hub photograph"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-dark/15 bg-white text-dark transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={showNext}
                        aria-label="Show next hub photograph"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-dark/15 bg-white text-dark transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                    <button
                        key={photo.src}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show photograph ${index + 1}`}
                        aria-current={index === activeIndex ? "true" : undefined}
                        className={`relative aspect-[3/2] overflow-hidden rounded-2xl border-2 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                            index === activeIndex ? "border-primary opacity-100" : "border-transparent opacity-55 hover:opacity-90"
                        }`}
                    >
                        <Image src={photo.src} alt="" fill sizes="160px" className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
