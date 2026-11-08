"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import type { ImpactRecord } from "@/lib/impact/types";
import ImpactRecordGallery from "./ImpactRecordGallery";

export function formatImpactDate(value: string) {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export default function ImpactRecordCard({ record, gardenName, step, inDevelopment = false, preview = false }: {
    record: ImpactRecord;
    gardenName: string;
    step?: number;
    inDevelopment?: boolean;
    preview?: boolean;
}) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const detailId = useId();
    const titleId = `${detailId}-title`;
    const mediaCount = record.media.length;
    const Heading = inDevelopment ? "h5" : "h3";
    const cardDate = inDevelopment ? record.development?.occurredOn : record.recordedAt;
    const eventDateLabel = record.development?.stage === "opening" ? "Reported opening date" : "Reported milestone date";
    const dateLabel = inDevelopment ? eventDateLabel : preview ? "Example date" : "Recorded";
    const showImageCount = !preview && mediaCount > 0;
    const index = Math.min(selectedImage, Math.max(0, mediaCount - 1));
    const currentImage = record.media[index];
    const closeDetails = () => dialog.current?.close();
    const gallery = { media: record.media, index, onMove: moveImage, title: record.title, preview };

    function moveImage(offset: -1 | 1) {
        setSelectedImage(previous => (Math.min(previous, mediaCount - 1) + offset + mediaCount) % mediaCount);
    }

    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = previousOverflow; };
    }, [isOpen]);

    return <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-primary/15 bg-white shadow-sm" data-testid="impact-record">
        <ImpactRecordGallery {...gallery} step={step} />
        <div className="flex flex-1 flex-col p-6">
            <p className="font-body text-xs font-bold uppercase tracking-wide text-primary">{gardenName} · {preview ? "Illustrative record" : "Steward approved"}</p>
            <Heading className="mt-3 font-heading text-2xl font-bold leading-tight">{record.title}</Heading>
            {record.summary && <p className="mt-4 font-body leading-relaxed text-dark/75">{record.summary}</p>}
            {record.measurements.length > 0 && <dl className="mt-5 flex flex-wrap gap-6">{record.measurements.map(metric => <div key={metric.label}><dt className="font-body text-xs text-dark/65">{metric.label}</dt><dd className="mt-1 font-heading text-2xl font-bold text-primary">{metric.value}</dd></div>)}</dl>}
            {(cardDate || showImageCount) && <p className="mt-5 font-body text-sm text-dark/65">
                {cardDate && <>{dateLabel} <time dateTime={cardDate}>{formatImpactDate(cardDate)}</time></>}
                {showImageCount && <>{cardDate && " · "}{mediaCount} {mediaCount === 1 ? "image" : "images"}</>}
            </p>}
            {preview && <p className="mt-5 font-body text-xs leading-relaxed text-dark/65">Design sample only. No attestation or approval is claimed.</p>}
            <div className="mt-auto flex flex-wrap items-center gap-x-4 pt-4">
                <button type="button" ref={trigger} aria-haspopup="dialog" aria-controls={detailId} aria-expanded={isOpen}
                    aria-label={`View impact details for ${record.title}`}
                    className={buttonStyles({ variant: "text", className: "bg-vibrant px-4" })}
                    onClick={() => {
                        if (!dialog.current || dialog.current.open) return;
                        dialog.current.showModal();
                        setIsOpen(true);
                    }}>
                    View impact details
                </button>
                {!preview && <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${record.title} on Green Goods`} className={buttonStyles({ variant: "text", className: "px-0 underline underline-offset-4" })}>
                    View on Green Goods <ArrowUpRight size={16} aria-hidden="true" />
                </a>}
            </div>
        </div>
        <dialog ref={dialog} id={detailId} aria-labelledby={titleId} data-lenis-prevent
            className="fixed inset-x-0 top-auto bottom-0 m-0 h-fit max-h-9/10 w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl border-0 bg-white p-0 text-dark shadow-2xl backdrop:bg-dark/60 md:inset-0 md:m-auto md:w-11/12 md:max-w-4xl md:rounded-3xl"
            onClose={() => { setIsOpen(false); trigger.current?.focus({ preventScroll: true }); }}
            onClick={event => {
                if (event.target !== event.currentTarget) return;
                const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
                if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) closeDetails();
            }}>
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-primary/15 bg-white px-5 py-4 md:px-8">
                <div>
                    <p className="font-body text-xs font-bold uppercase tracking-wide text-primary">{gardenName} · {preview ? "Illustrative record" : "Steward approved"}</p>
                    <h3 id={titleId} className="mt-1 font-heading text-2xl font-bold md:text-3xl">{record.title}</h3>
                </div>
                <button type="button" aria-label="Close impact details" onClick={closeDetails} className={buttonStyles({ variant: "text", className: "shrink-0" })}>
                    <X size={24} aria-hidden="true" />
                </button>
            </header>
            {isOpen && <div className="space-y-5 px-5 pt-5 pb-8 md:px-8">
                {currentImage && <div>
                    <ImpactRecordGallery {...gallery} expanded />
                    <a href={currentImage} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "text", className: "px-0 underline underline-offset-4" })}>
                        Open original image <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                </div>}
                {record.summary && <p className="font-body text-lg leading-relaxed">{record.summary}</p>}
                {inDevelopment && cardDate && <p className="font-body text-sm">{dateLabel} <time dateTime={cardDate}>{formatImpactDate(cardDate)}</time></p>}
                {record.measurements.length > 0 && <dl className="flex flex-wrap gap-6 rounded-2xl bg-vibrant/60 p-4">
                    {record.measurements.map(metric => <div key={metric.label}>
                        <dt className="font-body text-sm text-dark/70">{metric.label}</dt>
                        <dd className="mt-1 font-heading text-xl font-bold">{metric.value}</dd>
                    </div>)}
                </dl>}
                {record.sourceDescription && <section>
                    <h4 className="font-heading text-lg font-bold">Original work note from Green Goods</h4>
                    <blockquote className="mt-2 whitespace-pre-line border-l-2 border-primary/25 pl-4 font-body leading-relaxed text-dark/80">{record.sourceDescription}</blockquote>
                </section>}
                <section className="border-t border-primary/15 pt-4">
                    <h4 className="font-heading text-lg font-bold">{preview ? "Example record date" : "Attestation dates"}</h4>
                    <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3 font-body text-sm">
                        <div>
                            <dt className="font-semibold">Recorded</dt>
                            <dd><time dateTime={record.recordedAt}>{formatImpactDate(record.recordedAt)}</time></dd>
                        </div>
                        {!preview && <div>
                            <dt className="font-semibold">Steward approved</dt>
                            <dd><time dateTime={record.approvedAt}>{formatImpactDate(record.approvedAt)}</time></dd>
                        </div>}
                    </dl>
                </section>
                {preview ? <p className="font-body text-sm text-dark/70">Illustrative work. Photographs are from the Awka gallery.</p> : <>
                    <div className="flex flex-wrap gap-x-5">
                        <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "text", className: "px-0 underline underline-offset-4" })}>View on Green Goods <ArrowUpRight size={16} aria-hidden="true" /></a>
                        <a href={record.attestationUrl} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "text", className: "px-0 underline underline-offset-4" })}>Read the original attestation <ArrowUpRight size={16} aria-hidden="true" /></a>
                    </div>
                </>}
            </div>}
        </dialog>
    </article>;
}
