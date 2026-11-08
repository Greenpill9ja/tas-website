import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import ImpactContent from "@/components/impact/ImpactContent";
import ImpactHero from "@/components/impact/ImpactHero";
import Footer from "@/components/sections/Footer";
import { previewGardens, previewTestimonials } from "@/lib/impact/preview";

export const metadata: Metadata = {
    title: "Multi-hub Design Preview | Tech & Sun",
    description: "An illustrative preview of impact across multiple TAS hubs. Not live impact data.",
    robots: { index: false, follow: false },
};

export default async function ImpactPreviewPage({ searchParams }: { searchParams: Promise<{ hub?: string | string[] }> }) {
    const { hub } = await searchParams;
    return <>
        <a href="#impact-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-dark px-5 py-3 text-sm font-bold text-white focus:translate-y-0">Skip to content</a>
        <SiteHeader />
        <main id="impact-content" tabIndex={-1} className="bg-white text-dark outline-none">
            <ImpactHero preview />
            <ImpactContent key={typeof hub === "string" ? hub : "all"} gardens={previewGardens} initialGardenId={typeof hub === "string" ? hub : "all"} preview quotes={previewTestimonials} />
        </main>
        <Footer showMemorial={false} />
    </>;
}
