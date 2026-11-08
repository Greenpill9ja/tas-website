"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, BookOpen, CheckCircle2, Sun } from "lucide-react";
import { monthlyReports, testimonials } from "@/lib/impact/gardens";
import { belongsInDevelopment } from "@/lib/impact/development";
import type { GardenImpact, Testimonial } from "@/lib/impact/types";
import { publicHttpsUrl } from "@/lib/impact/validation";
import { buttonStyles } from "@/components/ui/button-styles";
import ImpactRecordCard, { formatImpactDate } from "./ImpactRecordCard";
import ImpactDevelopment from "./ImpactDevelopment";
import LocallyRooted from "./LocallyRooted";

const selectStyle = "min-h-12 max-w-full rounded-xl border border-primary/25 bg-white px-4 font-body text-base text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export default function ImpactContent({ gardens, initialGardenId = "all", preview = false, quotes: suppliedQuotes = testimonials }: {
    gardens: GardenImpact[];
    initialGardenId?: string;
    preview?: boolean;
    quotes?: Testimonial[];
}) {
    const [gardenId, setGardenId] = useState(gardens.some(item => item.garden.id === initialGardenId) ? initialGardenId : "all");
    const [month, setMonth] = useState("");
    function changeGarden(id: string) {
        setGardenId(id);
        setMonth("");
        const url = new URL(window.location.href);
        if (id === "all") url.searchParams.delete("hub");
        else url.searchParams.set("hub", id);
        window.history.replaceState(null, "", url);
    }
    const selected = gardens.filter(item => gardenId === "all" || item.garden.id === gardenId);
    const records = [...new Map(selected.flatMap(item => item.records).map(record => [record.id, record])).values()]
        .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt) || a.id.localeCompare(b.id));
    const construction = records.filter(record => record.track === "construction");
    const community = records.filter(record => record.track === "community").reverse();
    const development = records.filter(belongsInDevelopment);
    const communityFeed = community.filter(record => !belongsInDevelopment(record));
    const unclassified = records.filter(record => record.track === null).reverse();
    const complete = selected.every(item => item.historyComplete);
    const approved = selected.every(item => item.approvedWorkCount !== null) ? selected.reduce((total, item) => total + item.approvedWorkCount!, 0) : null;
    const unavailable = selected.filter(item => item.status === "unavailable" || (item.status === "partial" && item.approvedCountSource !== "attestations"));
    const attestationCounts = selected.filter(item => item.approvedCountSource === "attestations");
    const stale = selected.filter(item => item.status === "stale");
    const fetchedAt = selected.map(item => item.fetchedAt).filter((value): value is string => value !== null).sort()[0];
    const reports = monthlyReports.filter(report => !preview && (gardenId === "all" || report.gardenId === gardenId) && report.reviewedAt && publicHttpsUrl(report.sourceUrl));
    const report = reports.find(item => `${item.gardenId}:${item.month}` === month) ?? reports[0];
    const quotes = suppliedQuotes.filter(item => (gardenId === "all" || item.gardenId === gardenId) && (item.kind === "sample" || (item.consentRecordedAt && publicHttpsUrl(item.sourceUrl))));
    const gardenName = (id: string) => gardens.find(item => item.garden.id === id)?.garden.name ?? id;
    const scopeName = gardenId === "all" ? "All TAS hubs" : gardenName(gardenId);
    const operatingStatus = { active: "Open to the community", building: "Taking shape", archived: "Archived" };
    const metrics = [
        { icon: "/Hub-icon.png", label: "Active hubs", value: selected.filter(item => item.garden.status === "active").length, note: "Places open to the community" },
        { icon: "/Node.png", label: preview ? "Example work records" : "Approved work records", value: approved, note: preview ? "Illustrative activity for this design" : "Reviewed by garden stewards" },
        { icon: "/Solar Panel.png", label: "Development records", value: complete ? construction.length : null, note: "From site preparation to fit-out" },
        { icon: "/Internet (Starlink) green.png", label: "Learning & community", value: complete ? community.length : null, note: "Records of life at the hub" },
    ];

    return <>
        {preview && <aside className="border-y border-primary/15 bg-secondary/20 px-4 py-5" aria-label="Multi-hub preview notice"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><p className="max-w-3xl font-body text-sm leading-relaxed"><strong>Multi-hub design preview.</strong> All three hubs, their figures and work records are illustrative. Photographs are from the Awka gallery, not evidence for these example hubs.</p><a href="/impact" className={buttonStyles({ variant: "text" })}>Return to live impact <ArrowUpRight size={18} aria-hidden="true" /></a></div></aside>}
        <section id="impact-overview" className="scroll-mt-24 bg-primary/5 px-4 py-20 md:py-28" data-testid="impact-overview">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div><p className="font-body text-xs font-bold uppercase tracking-widest text-primary">01 / Our progress</p><h2 className="mt-4 font-heading text-4xl font-bold md:text-6xl">Built together.<br />Recorded openly.</h2><p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-dark/70">Follow the spaces we build and the life within them. Choose a hub to explore its part in the story.</p></div>
                    <label className="grid gap-2 font-body text-xs font-bold uppercase tracking-wide">View impact for<select aria-label="View impact for" value={gardenId} onChange={event => changeGarden(event.target.value)} className={`${selectStyle} font-normal normal-case`}><option value="all">All TAS hubs</option>{gardens.map(item => <option key={item.garden.id} value={item.garden.id}>{item.garden.name}</option>)}</select></label>
                </div>
                {gardens.length > 1 && <div className="mt-10" data-testid="impact-hubs">
                    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-heading text-xl font-bold">A network of local possibilities</h3><button type="button" onClick={() => changeGarden("all")} aria-pressed={gardenId === "all"} className={buttonStyles({ variant: "text" })}>View all hubs</button></div>
                    <ul className="mt-4 grid gap-4 md:grid-cols-3">{gardens.map(item => <li key={item.garden.id} className={`flex flex-col rounded-3xl border bg-white p-6 shadow-sm ${gardenId === item.garden.id ? "border-primary ring-2 ring-primary/20" : "border-primary/15"}`}>
                        <p className="font-body text-xs font-bold uppercase tracking-wide text-primary">{operatingStatus[item.garden.status]}</p>
                        <h4 className="mt-3 font-heading text-2xl font-bold">{item.garden.name}</h4>
                        <p className="mt-2 font-body text-sm text-dark/65">{item.garden.location}</p>
                        <p className="mt-5 font-body text-sm text-dark/75">{item.approvedWorkCount === null ? "Work total unavailable" : `${item.approvedWorkCount} ${preview ? "example" : "approved"} work records`}{!item.historyComplete && " · partial history"}{item.status === "stale" && " · refresh pending"}</p>
                        <button type="button" aria-pressed={gardenId === item.garden.id} onClick={() => changeGarden(item.garden.id)} className={buttonStyles({ variant: "text", className: "mt-auto self-start pt-5" })}>{gardenId === item.garden.id ? "Viewing this hub" : "View this hub"}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">{item.garden.name}</span></button>
                    </li>)}</ul>
                </div>}
                <p role="status" className="mt-10 font-body text-sm text-dark/70" data-testid="impact-scope">{scopeName} · {selected.length} {selected.length === 1 ? "hub" : "hubs"} · {records.length} {preview ? "example" : "available"} work records{preview ? " · illustrative data" : " · all reporting dates"}</p>
                <div>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(metric => <div key={metric.label} className="flex h-full flex-col rounded-3xl border border-primary/15 bg-white p-6 shadow-sm"><div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-vibrant/60"><Image src={metric.icon} alt="" width={64} height={64} unoptimized className="h-16 w-16 object-contain" /></div><dt className="mt-6 font-heading text-lg font-bold">{metric.label}</dt><dd className="mt-3 font-heading text-4xl font-bold text-primary xl:text-5xl">{metric.value ?? "—"}</dd><p className="mt-5 font-body text-sm leading-relaxed text-dark/65">{metric.note}</p></div>)}</dl>
                    <p className="mt-6 font-body text-sm text-dark/65">{preview ? "Example totals demonstrate filtering. They are not reported TAS outcomes." : <>Work records across all reporting dates.{fetchedAt && <> Updated {formatImpactDate(fetchedAt)}.</>}</>}</p>
                    {attestationCounts.length > 0 && <p role="status" className="mt-4 font-body text-sm text-dark/75">Work counts for {attestationCounts.map(item => item.garden.name).join(", ")} come from the complete public attestation history while the Green Goods summary is unavailable.</p>}
                    {stale.length > 0 && <p role="status" className="mt-4 font-body text-sm text-dark/75">{stale.map(item => item.garden.name).join(", ")}: showing the last successfully fetched records while we refresh the sources.</p>}
                    {unavailable.length > 0 && <p role="status" className="mt-4 rounded-xl border border-primary/20 bg-white p-4 font-body text-sm text-dark/80">{unavailable.map(item => item.garden.name).join(", ")}: some evidence is temporarily unavailable. Available records are shown; incomplete totals appear as —. <a href="/impact" className="inline-flex min-h-12 items-center font-bold text-primary underline">Refresh impact</a></p>}
                </div>
                {report && <section id="monthly-report" className="mt-10 border-t border-primary/15 pt-8" data-testid="impact-monthly">
                    <div className="flex flex-wrap items-end justify-between gap-4"><h3 className="font-heading text-2xl font-bold">A month at the hub</h3><label className="flex flex-col gap-2 font-body text-sm">Reporting month<select className={selectStyle} value={`${report.gardenId}:${report.month}`} onChange={event => setMonth(event.target.value)}>{reports.map(item => <option key={`${item.gardenId}:${item.month}`} value={`${item.gardenId}:${item.month}`}>{gardenName(item.gardenId)} · {item.month}</option>)}</select></label></div>
                    <dl className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">{report.metrics.map(metric => <div key={metric.label}><dt className="font-body text-sm">{metric.label}</dt><dd className="mt-2 font-heading text-3xl font-bold text-primary">{metric.value} <span className="text-base">{metric.unit}</span></dd><p className="mt-2 font-body text-xs text-dark/65">{metric.definition}</p></div>)}</dl>
                    <a href={publicHttpsUrl(report.sourceUrl)!} className="mt-4 inline-flex min-h-12 items-center font-body text-sm text-primary underline">Read the source report</a>
                    {report.pdfUrl && publicHttpsUrl(report.pdfUrl) && <a href={publicHttpsUrl(report.pdfUrl)!} className="ml-6 inline-flex min-h-12 items-center font-body text-sm text-primary underline">View report PDF</a>}
                </section>}
            </div>
        </section>
        <section id="hub-development" className="scroll-mt-24 px-4 py-20 md:py-28" data-testid="impact-construction">
            <div className="mx-auto max-w-6xl">
                <p className="font-body text-xs font-bold uppercase tracking-widest text-primary">02 / Hub development · {scopeName}</p>
                <h2 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl">From a site to a place<br className="hidden sm:block" /> full of possibility.</h2>
                <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-dark/75">
                    {preview ? "Explore separate development stories for each example hub." : "Follow each hub from design through opening as evidence becomes available. Open a record for photographs and attestation dates."}
                </p>
                <div className="mt-10 space-y-14">
                    {selected.map(impact => <ImpactDevelopment key={impact.garden.id} impact={impact}
                        records={development.filter(record => record.gardenId === impact.garden.id)} preview={preview} />)}
                </div>
            </div>
        </section>
        <section id="community-work" className="scroll-mt-24 px-4 py-20 md:py-28" data-testid="impact-community">
            <div className="mx-auto max-w-6xl"><p className="font-body text-xs font-bold uppercase tracking-widest text-primary">03 / Community in action · {scopeName}</p><h2 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl">Behind every number,<br />people doing the work.</h2><p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-dark/75">{preview ? "A shared feed brings activity from different hubs together. Choose one hub above to follow its community." : "Workshops, everyday access and the care that keeps a shared space useful. Explore the activities our community has documented."}</p>
                {communityFeed.length !== community.length && <a href="#hub-development" className={buttonStyles({ variant: "text", className: "mt-3 px-0 underline underline-offset-4" })}>See opening records in the hub timelines</a>}
                {communityFeed.length > 0 && <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{communityFeed.map(record => <li key={record.id}><ImpactRecordCard record={record} gardenName={gardenName(record.gardenId)} preview={preview} /></li>)}</ul>}
                {community.length === 0 && <p className="mt-8 font-body text-dark/70">{complete ? (preview ? "No example learning or community records for this selection yet." : "No approved learning or community records for this selection yet.") : "Community records are temporarily unavailable."}</p>}
                {unclassified.length > 0 && <div className="mt-12"><h3 className="font-heading text-2xl font-bold">More recorded work</h3><ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{unclassified.map(record => <li key={record.id}><ImpactRecordCard record={record} gardenName={gardenName(record.gardenId)} preview={preview} /></li>)}</ul></div>}
            </div>
        </section>
        <LocallyRooted />
        {quotes.length > 0 && <section id="community-voices" className="px-4 py-20 md:py-28" data-testid="impact-testimonials">
            <div className="mx-auto max-w-6xl">
                <p className="font-body text-xs font-bold uppercase tracking-widest text-primary">05 / Community voices · {scopeName}</p>
                <h2 className="mt-4 font-heading text-4xl font-bold md:text-5xl">What access makes possible</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {quotes.map(quote => <figure key={`${quote.gardenId}:${quote.quote}`} className="flex flex-col rounded-3xl bg-primary/5 p-6">
                        {quote.kind === "sample" && <p className="mb-4 font-body text-xs font-bold uppercase tracking-wide text-primary">Illustrative quote · awaiting member testimonial</p>}
                        <blockquote className="font-body text-lg leading-relaxed">“{quote.quote}”</blockquote>
                        <figcaption className="mt-auto pt-5 font-body text-sm">{quote.kind === "approved" ? <a href={publicHttpsUrl(quote.sourceUrl)!} className="text-primary underline">{quote.attribution}</a> : quote.attribution} · {gardenName(quote.gardenId)}</figcaption>
                    </figure>)}
                </div>
            </div>
        </section>}
        <section id="how-we-measure" className="bg-primary/5 px-4 py-20 md:py-28"><div className="mx-auto max-w-6xl"><p className="font-body text-xs font-bold uppercase tracking-widest text-primary">06 / How we measure</p><h2 className="mt-4 font-heading text-4xl font-bold md:text-5xl">A record you can follow.</h2>{preview && <p className="mt-5 max-w-2xl font-body text-dark/70">This is how the live page uses evidence. The example cards above carry no approval or verification claim.</p>}<div className="mt-10 grid gap-8 md:grid-cols-3">{[
            { icon: BookOpen, title: "Community recorded", body: "Gardeners document work with notes and photographs. Every card links back to its original record." },
            { icon: CheckCircle2, title: "Steward reviewed", body: "Published work has a positive, unrevoked steward approval in Green Goods. Approval records a community review; it is not an independent measurement of every outcome." },
            { icon: Sun, title: "Measured with context", body: "Work counts describe documented activity. Energy use, attendance and learning hours need their own reporting period, method and source." },
        ].map(item => <article key={item.title}><item.icon className="h-8 w-8 text-primary" aria-hidden="true" /><h3 className="mt-5 font-heading text-2xl font-bold">{item.title}</h3><p className="mt-4 font-body leading-relaxed text-dark/75">{item.body}</p></article>)}</div></div></section>
        <section className="bg-primary px-4 py-20 text-white md:py-28"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="font-body text-xs font-bold uppercase tracking-widest text-secondary">Build the next possibility</p><h2 className="mt-4 max-w-2xl font-heading text-4xl font-bold md:text-5xl">Help local learning<br />keep moving.</h2><p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-white/80">Educational resources, mentorship, equipment, relationships or funding. Start with a conversation about what the community needs next.</p></div><a href="#contact" className={buttonStyles()}>Talk with the TAS team <ArrowUpRight size={20} aria-hidden="true" /></a></div></section>
    </>;
}
