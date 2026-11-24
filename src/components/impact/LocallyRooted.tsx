import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";

export default function LocallyRooted() {
    return <section id="locally-rooted" className="bg-vibrant px-4 py-20 md:py-28" data-testid="impact-locally-rooted">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-feature">
                <Image src="/album/16-community-launch.jpeg" alt="The TAS community outside its solar-powered hub in Awka" fill unoptimized sizes="(min-width: 1024px) 560px, 96vw" className="object-cover" />
            </div>
            <div>
                <p className="font-body text-xs font-bold uppercase tracking-widest text-primary">04 / Locally rooted · Awka</p>
                <h2 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5xl">Infrastructure matters.<br />The people make it useful.</h2>
                <p className="mt-6 font-body text-lg leading-relaxed text-dark/70">A small local team keeps Awka open, supports participants and brings builders and creatives together. Access supports participation in hub learning programmes and community activities.</p>
                <p className="mt-5 font-body leading-relaxed text-dark/70">The aim is more than a place to plug in. It is a place to learn with others, contribute something useful and build relationships that open possibilities.</p>
                <a href="/about" className={buttonStyles({ className: "mt-8" })}>Meet Tech &amp; Sun <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
        </div>
    </section>;
}
