import Link from "next/link";
import { buttonStyles } from "@/components/ui/button-styles";
import { ArrowUpRight } from "lucide-react";

export default function ImpactPreview() {
    return <section id="impact-preview" className="border-y border-primary/10 bg-primary/5 px-4 py-20 md:py-24"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-end"><div><p className="font-body text-xs font-bold uppercase tracking-widest text-primary">Our impact</p><h2 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5xl">See what access<br />makes possible.</h2></div><div><p className="max-w-xl font-body text-lg leading-relaxed text-dark/70">Explore monthly hub activity and the community work behind it, with sources and clear reporting boundaries.</p><Link href="/impact" className={buttonStyles({ className: "mt-7" })}>Explore our impact <ArrowUpRight size={20} aria-hidden="true" /></Link><p className="mt-3 font-body text-xs text-dark/60">Staging preview · Data connection in progress</p></div></div></section>;
}
