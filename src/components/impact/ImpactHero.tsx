import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";

export default function ImpactHero({ preview = false }: { preview?: boolean }) {
    return <section className="bg-vibrant px-4 pb-20 pt-32 md:pb-28 md:pt-36">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
                <p className="font-body text-xs font-bold uppercase tracking-widest text-primary">Our impact · {preview ? "A growing TAS network · design preview" : "Tech & Sun hubs"}</p>
                <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl xl:text-6xl">Local infrastructure.<br /><span className="text-primary">Shared possibilities.</span></h1>
                <p className="mt-7 max-w-xl font-body text-lg leading-relaxed text-dark/75 md:text-xl">Dependable power, internet and a place to learn. Explore how our hubs are used, what our community is building and the evidence behind our progress.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                    <a href="#impact-overview" className={buttonStyles()}>Explore our progress <ArrowDown size={18} aria-hidden="true" /></a>
                    <a href="#community-work" className={buttonStyles({ variant: "text" })}>Community work <ArrowUpRight size={18} aria-hidden="true" /></a>
                </div>
                <p className="mt-8 font-body text-xs leading-relaxed text-dark/60">{preview ? "Three example hubs show how this page could grow. All figures and work in this variation are illustrative." : "Starting with Awka. Only registered TAS hubs contribute to these totals."}</p>
            </div>
            <figure>
                <div className="relative aspect-square overflow-hidden rounded-feature shadow-xl">
                    <Image src="/album/16-community-launch.jpeg" alt="The TAS community gathered outside the Awka hub" fill priority unoptimized sizes="(min-width: 1024px) 560px, 96vw" className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark to-transparent px-7 pb-7 pt-20"><p className="font-heading text-2xl font-bold text-white">Built locally.<br />Made useful together.</p></div>
                </div>
                <figcaption className="mt-3 font-body text-xs text-dark/60">From the TAS community gallery in Awka.</figcaption>
            </figure>
        </div>
    </section>;
}
