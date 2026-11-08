import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import ImpactContent from "@/components/impact/ImpactContent";
import ImpactHero from "@/components/impact/ImpactHero";
import Footer from "@/components/sections/Footer";
import { getTasImpact } from "@/lib/impact/server";

export const metadata: Metadata = {
    title: "Our Impact | Tech & Sun",
    description: "Follow the development of Tech & Sun hubs and the learning and community work they make possible, with public Green Goods evidence.",
    robots: { index: false, follow: true },
};

// Render current source status; successful garden snapshots refresh independently.
export const dynamic = "force-dynamic";

async function LiveImpactContent({ hub }: { hub: string }) {
    return <ImpactContent key={hub} gardens={await getTasImpact()} initialGardenId={hub} />;
}

export default async function ImpactPage({ searchParams }: { searchParams: Promise<{ hub?: string | string[] }> }) {
    const { hub } = await searchParams;
    return <>
        <a href="#impact-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-dark px-5 py-3 text-sm font-bold text-white focus:translate-y-0">Skip to content</a>
        <SiteHeader />
        <main id="impact-content" tabIndex={-1} className="bg-white text-dark outline-none">
            <ImpactHero />
            <Suspense fallback={<section id="impact-overview" className="bg-primary/5 px-4 py-12"><p role="status" className="mx-auto max-w-6xl font-body text-dark/75">Loading the latest hub records…</p></section>}>
                <LiveImpactContent hub={typeof hub === "string" ? hub : "all"} />
            </Suspense>
        </main>
        <Footer showMemorial={false} />
    </>;
}
