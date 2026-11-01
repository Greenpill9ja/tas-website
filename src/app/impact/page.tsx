import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import { buttonStyles } from "@/components/ui/button-styles";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import ImpactContent from "@/components/impact/ImpactContent";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
    title: "Our Impact | Tech & Sun",
    description: "Explore monthly Awka hub activity and the community work behind Tech & Sun's solar-powered learning spaces.",
    // Staging fixture content must not be indexed as real impact evidence.
    robots: { index: false, follow: true },
};

export default function ImpactPage() {
    return <>
        <a href="#impact-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-dark px-5 py-3 text-sm font-bold text-white focus:translate-y-0">Skip to content</a>
        <SiteHeader />
        <main id="impact-content" tabIndex={-1} className="bg-white text-dark outline-none">
            <section className="bg-vibrant px-4 pb-20 pt-32 md:pb-28 md:pt-36"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center"><div><p className="font-body text-xs font-bold uppercase tracking-widest text-primary">Our impact · Awka, Nigeria</p><h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl xl:text-6xl">Local infrastructure.<br /><span className="text-primary">Shared possibilities.</span></h1><p className="mt-7 max-w-xl font-body text-lg leading-relaxed text-dark/75 md:text-xl">Dependable power, internet and a place to learn. Explore how the Awka hub is used, what our community is building and the evidence behind our progress.</p><div className="mt-8 flex flex-wrap gap-4"><a href="#monthly-report" className={buttonStyles()}>Explore the monthly report <ArrowDown size={18} aria-hidden="true" /></a><a href="#community-work" className={buttonStyles({ variant: "text" })}>Community work <ArrowUpRight size={18} aria-hidden="true" /></a></div><p className="mt-8 font-body text-xs leading-relaxed text-dark/60">Currently reporting: Awka. Planned locations are not included in these totals.</p></div><figure><div className="relative aspect-square overflow-hidden rounded-feature shadow-xl"><Image src="/album/16-community-launch.jpeg" alt="The TAS community gathered outside the hub" fill priority sizes="(min-width: 1024px) 560px, 96vw" className="object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark to-transparent px-7 pb-7 pt-20"><p className="font-heading text-2xl font-bold text-white">Built locally.<br />Made useful together.</p></div></div><figcaption className="mt-3 font-body text-xs text-dark/60">From the TAS community gallery. Work records below remain illustrative until connected.</figcaption></figure></div></section>
            <ImpactContent />
        </main>
        <Footer />
    </>;
}
