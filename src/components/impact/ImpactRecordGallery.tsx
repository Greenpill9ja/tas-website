"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";

function RecordImage({ src, alt, expanded }: { src?: string; alt: string; expanded: boolean }) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return <div className="flex h-full flex-col items-center justify-center gap-3 text-primary">
            <ImageIcon size={32} aria-hidden="true" />
            <span className="font-body text-sm">{failed ? "Image unavailable" : "No images attached"}</span>
        </div>;
    }

    return <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        loading={expanded ? "eager" : "lazy"}
        sizes={expanded ? "(min-width: 768px) 840px, 96vw" : "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 96vw"}
        className={expanded ? "object-contain" : "object-cover"}
        onError={() => setFailed(true)}
    />;
}

export default function ImpactRecordGallery({ media, index, onMove, title, step, expanded = false, preview = false }: {
    media: string[];
    index: number;
    onMove: (offset: -1 | 1) => void;
    title: string;
    step?: number;
    expanded?: boolean;
    preview?: boolean;
}) {
    const src = media[index];
    const alt = preview ? "Awka gallery photograph illustrating a sample record" : `Evidence for ${title}`;
    const arrowStyle = buttonStyles({ variant: "text", className: "min-w-12 bg-white shadow-md focus-visible:outline-offset-2" });

    return <figure
        aria-label={`Images for ${title}`}
        className={`relative bg-primary/5 ${expanded ? "aspect-square max-h-96 overflow-hidden rounded-2xl md:aspect-video" : "aspect-video"}`}
    >
        <RecordImage key={src} src={src} alt={alt} expanded={expanded} />
        {step !== undefined && <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-heading text-lg font-bold text-dark">{String(step).padStart(2, "0")}</span>}
        {media.length > 1 && <>
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                <button type="button" className={arrowStyle} aria-label="Previous image" onClick={() => onMove(-1)}>
                    <ChevronLeft size={24} aria-hidden="true" />
                </button>
                <button type="button" className={arrowStyle} aria-label="Next image" onClick={() => onMove(1)}>
                    <ChevronRight size={24} aria-hidden="true" />
                </button>
            </div>
            <figcaption role="status" className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto w-fit rounded-full bg-dark/80 px-3 py-1 text-sm font-semibold text-white">
                Image {index + 1} of {media.length}
            </figcaption>
        </>}
    </figure>;
}
