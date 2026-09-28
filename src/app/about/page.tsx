import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, House, Linkedin, Sun, Twitter, Wifi, Youtube } from "lucide-react";
import AboutContactForm from "@/components/about/AboutContactForm";
import AboutHeroCarousel from "@/components/about/AboutHeroCarousel";

export const metadata: Metadata = {
    title: "About Tech & Sun (TAS)",
    description: "Tech & Sun builds dependable, solar-powered community infrastructure across Nigeria.",
    alternates: { canonical: "/about" },
    openGraph: {
        title: "About Tech & Sun",
        description: "Free, solar-backed hubs where Nigerian students, creatives and builders can learn, work and grow.",
        url: "/about",
    },
};

const services = [
    { icon: Sun, title: "Reliable electricity", body: "Solar generation and battery storage keep work moving." },
    { icon: Wifi, title: "Fast internet", body: "Starlink connectivity for learning, collaboration and shipping." },
    { icon: House, title: "A place to build", body: "Welcoming space for focused work, workshops and community." },
    { icon: ArrowUpRight, title: "Builder pathways", body: "Events, networks and tools that turn access into opportunity." },
];

const audiences = [
    { number: "01", title: "Students", body: "Students get dependable power, internet and a focused place to study or research. Learning sessions and peer support help them turn access into practical progress." },
    { number: "02", title: "Creatives", body: "Creatives can develop and share their work using dependable tools and connectivity. The hub also gives them a community for feedback, collaboration and visibility." },
    { number: "03", title: "Builders", body: "Builders can code, prototype and participate in open-source ecosystems. Workshops, mentorship and community connections help ideas become useful projects." },
];

const growthSteps = [
    { number: "01", title: "Learn", body: "Learn what students, creatives and builders need from a shared space. Work with trusted local stewards to shape the hub around those priorities." },
    { number: "02", title: "Build", body: "Build the essential infrastructure: solar power, battery storage, internet and a functional workspace. Local partners help turn the plan into a dependable place." },
    { number: "03", title: "Activate", body: "Activate the hub through open access, learning sessions and community programming. Support helps participants use the infrastructure with confidence." },
    { number: "04", title: "Grow", body: "Grow by learning from how the hub is used and strengthening local partnerships. Each lesson improves the model for future communities." },
];

const education = [
    { number: "01", title: "Digital skills & workshops", body: "Practical sessions help participants use digital tools, explore emerging technologies and build skills they can apply beyond the hub." },
    { number: "02", title: "Peer learning & mentorship", body: "Community-led learning creates room to ask questions, share experience and receive support from peers and experienced builders." },
    { number: "03", title: "Builder pathways", body: "Technical onboarding and project support connect learners to open-source communities, collaborators and opportunities to contribute." },
];

export default function AboutPage() {
    return (
        <>
            <a href="#about-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-dark px-5 py-3 font-body text-sm font-bold text-white transition-transform focus:translate-y-0">Skip to content</a>

            <header className="absolute inset-x-0 top-0 z-40">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
                    <Link href="/" aria-label="Tech and Sun home" className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                        <Image src="/Tas Logo-green.png" alt="" width={52} height={52} className="h-12 w-12 rounded-full" priority />
                    </Link>
                    <nav aria-label="About page" className="flex items-center gap-8">
                        <Link className="font-body text-sm font-semibold text-dark/70 hover:text-primary" href="/">Home</Link>
                        <a className="font-body text-sm font-bold text-dark" href="#about-content" aria-current="page">About</a>
                    </nav>
                    <a href="#contact" className="rounded-full bg-secondary px-5 py-3 font-heading text-sm font-bold text-dark shadow-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Partner with TAS</a>
                </div>
            </header>

            <main id="about-content" tabIndex={-1} className="w-full overflow-x-hidden bg-white text-dark outline-none">
                <section className="bg-gradient-to-b from-[#a5d5f5] to-[#e5f1ff] px-4 pb-20 pt-32 md:pb-24 md:pt-36">
                    <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
                        <div>
                            <h1 className="max-w-2xl font-heading text-5xl font-black leading-tight sm:text-6xl">About Tech &amp; Sun</h1>
                            <p className="mt-7 max-w-2xl font-body text-lg leading-relaxed text-dark/75 md:text-xl">Tech &amp; Sun is a community infrastructure initiative building dependable, solar-powered hubs across Nigeria. Our hubs give students, creatives, builders and local communities free access to electricity, internet and shared space to learn, work and grow.</p>
                            <p className="mt-8 inline-flex rounded-2xl border border-dark/10 bg-white/70 px-5 py-3 font-heading text-xs font-black uppercase tracking-widest text-dark">Community-led infrastructure&nbsp; • &nbsp;Access is free</p>
                        </div>
                        <AboutHeroCarousel />
                    </div>
                </section>

                <section className="px-4 py-20 md:py-28" aria-labelledby="why-title"><div className="mx-auto w-full max-w-6xl"><div className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="font-body text-xs font-black uppercase tracking-widest text-primary">Why we exist</p><h2 id="why-title" className="mt-4 font-heading text-4xl font-bold md:text-6xl">Why TAS exists</h2></div><p className="max-w-xl font-body text-lg leading-relaxed text-dark/70">Across Nigeria, unreliable electricity and costly connectivity interrupt learning, limit creative work and make it harder to build. TAS closes that gap with locally rooted infrastructure people can count on.</p></div><dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["24/7", "solar-backed power"], ["FREE", "access for community"], ["2", "hub locations"], ["1", "shared builder network"]].map(([value, label]) => <div key={label} className="rounded-3xl bg-[#e5f1ff] p-7"><dd className="font-heading text-4xl font-black text-primary">{value}</dd><dt className="mt-5 font-body text-base font-semibold text-dark/70">{label}</dt></div>)}</dl></div></section>

                <section className="bg-[#2f7326] px-4 py-20 text-white md:py-28" aria-labelledby="services-title"><div className="mx-auto w-full max-w-6xl"><p className="font-body text-xs font-black uppercase tracking-widest text-secondary">What the hubs provide</p><h2 id="services-title" className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-6xl">Free essentials for people ready to learn, build and grow.</h2><div className="mt-14 grid gap-5 md:grid-cols-2">{services.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-3xl border border-white/15 bg-white/10 p-7 md:p-9"><div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-dark"><Icon className="h-6 w-6" aria-hidden="true" /></span><h3 className="font-heading text-2xl font-bold">{title}</h3></div><p className="mt-5 max-w-xl font-body leading-relaxed text-white/75">{body}</p></article>)}</div></div></section>

                <section className="px-4 py-20 md:py-28" aria-labelledby="audience-title"><div className="mx-auto w-full max-w-6xl"><p className="font-body text-xs font-black uppercase tracking-widest text-primary">Built with the community</p><h2 id="audience-title" className="mt-4 max-w-xl font-heading text-4xl font-bold leading-tight md:text-6xl">One hub. Many ways to begin.</h2><div className="mt-14 grid gap-5 md:grid-cols-3">{audiences.map((item) => <article key={item.title} className="rounded-3xl border border-dark/10 bg-[#e5f1ff] p-7"><p className="font-heading text-sm font-black text-primary">{item.number}</p><h3 className="mt-8 font-heading text-3xl font-bold">{item.title}</h3><p className="mt-5 font-body leading-relaxed text-dark/70">{item.body}</p></article>)}</div></div></section>

                <section className="bg-[#e5f1ff] px-4 py-20 md:py-28" aria-labelledby="story-title"><div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center"><div><p className="font-body text-xs font-black uppercase tracking-widest text-primary">Our story</p><h2 id="story-title" className="mt-4 font-heading text-4xl font-bold md:text-6xl">How Tech &amp; Sun began</h2><p className="mt-8 max-w-xl font-body text-lg leading-relaxed text-dark/70">Tech &amp; Sun began with a simple belief: access to reliable infrastructure should not decide who gets to participate in the future.</p><p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-dark/70">The first hub in Owerri brought solar energy, internet and community stewardship into one shared space. The team continues that vision today by developing locally operated hubs for learning, creative work and building.</p><div className="mt-10 flex items-center gap-5 rounded-3xl bg-primary p-6 text-white shadow-xl"><div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white/20"><Image src="/izzy.jpg" alt="Obi Izzy Onwuzurike" fill sizes="96px" className="object-cover" /></div><div><p className="font-body text-xs font-black uppercase tracking-widest text-secondary">Founder • In loving memory</p><h3 className="mt-3 font-heading text-2xl font-bold">Obi “Izzy” Onwuzurike</h3><p className="mt-1 font-body text-sm text-white/70">Founder, Tech &amp; Sun Initiative</p></div></div></div><div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-xl"><Image src="/enuguhub.png" alt="A Tech and Sun community hub" fill sizes="(min-width: 1024px) 560px, 100%" className="object-cover" /></div></div></section>

                <section className="px-4 py-20 md:py-28" aria-labelledby="growth-title"><div className="mx-auto w-full max-w-6xl"><p className="font-body text-xs font-black uppercase tracking-widest text-primary">How a hub grows</p><h2 id="growth-title" className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-6xl">From a shared need to a community resource.</h2><ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{growthSteps.map((item) => <li key={item.title} className="rounded-3xl border border-dark/10 bg-[#e5f1ff] p-7"><p className="font-heading text-sm font-black text-primary">{item.number}</p><h3 className="mt-7 font-heading text-2xl font-bold">{item.title}</h3><p className="mt-4 font-body leading-relaxed text-dark/70">{item.body}</p></li>)}</ol></div></section>

                <section className="px-4 py-20 md:py-28" aria-labelledby="education-title"><div className="mx-auto w-full max-w-6xl"><p className="font-body text-xs font-black uppercase tracking-widest text-primary">Learning at the center</p><h2 id="education-title" className="mt-4 max-w-5xl font-heading text-4xl font-bold leading-tight md:text-6xl">Infrastructure becomes opportunity through education.</h2><p className="mt-6 max-w-3xl font-body text-lg leading-relaxed text-dark/70">TAS pairs free access with practical learning so people can confidently use the tools, networks and opportunities available through each hub.</p><div className="mt-14 grid gap-5 md:grid-cols-3">{education.map((item) => <article key={item.title} className="rounded-3xl border border-dark/10 bg-[#e5f1ff] p-7"><p className="font-heading text-sm font-black text-primary">{item.number}</p><h3 className="mt-8 font-heading text-2xl font-bold">{item.title}</h3><p className="mt-5 font-body leading-relaxed text-dark/70">{item.body}</p></article>)}</div></div></section>

                <section className="bg-[#e5f1ff] px-4 py-20 md:py-28" aria-labelledby="current-title"><div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center"><div><p className="font-body text-xs font-black uppercase tracking-widest text-primary">Where we are now</p><h2 id="current-title" className="mt-4 max-w-xl font-heading text-4xl font-bold md:text-6xl">What we are doing now</h2><ul className="mt-8 grid gap-3 font-body text-lg leading-relaxed text-dark/70"><li>• Keep the active hub dependable for daily learning and work.</li><li>• Run practical workshops, onboarding and community learning sessions.</li><li>• Document participation, lessons and outcomes to improve future hubs.</li><li>• Prepare the next location with local partners and community stewards.</li></ul></div><div className="grid gap-5 sm:grid-cols-2"><article className="rounded-3xl bg-white p-8 shadow-sm"><p className="font-body text-xs font-black uppercase tracking-widest text-dark">Awka</p><h3 className="mt-5 font-heading text-3xl font-bold text-primary">Active hub</h3><p className="mt-8 font-body leading-relaxed">Power • Internet<br />Workspace • Programs</p></article><article className="rounded-3xl bg-white p-8 shadow-sm"><p className="font-body text-xs font-black uppercase tracking-widest text-dark">Enugu</p><h3 className="mt-5 font-heading text-3xl font-bold text-primary">Coming next</h3><p className="mt-8 font-body leading-relaxed">Site development<br />and partner readiness</p></article></div></div></section>

                <section className="px-4 pb-20 pt-20 md:pb-28"><div className="mx-auto w-full max-w-6xl rounded-[2.4rem] bg-gradient-to-r from-primary to-[#5d9056] p-8 text-white shadow-2xl md:p-12"><p className="font-body text-xs font-black uppercase tracking-widest text-secondary">Connect with Tech &amp; Sun</p><div className="mt-5 grid gap-8 lg:grid-cols-2 lg:items-end"><h2 className="max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl">Partner, support or learn more about TAS.</h2><div><p className="font-body text-lg leading-relaxed text-white/75">Bring funding, expertise, equipment or local knowledge—or schedule a focused conversation with the team. You can also send a message using the single contact form below.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a className="rounded-full bg-secondary px-6 py-3 text-center font-heading text-sm font-bold text-dark" href="#contact">Schedule a call</a><Link className="rounded-full bg-white px-6 py-3 text-center font-heading text-sm font-bold text-primary" href="/#activities">Read our documentation</Link></div></div></div></div></section>
            </main>

            <footer id="contact" className="scroll-mt-20 border-t border-dark/10 bg-[#e5f1ff] px-4 pb-8 pt-20"><div className="mx-auto w-full max-w-2xl"><div className="text-center"><h2 className="font-heading text-4xl font-bold md:text-6xl">Get in touch</h2><p className="mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-dark/70">Send one message to ask about the hubs, explore a partnership or support the next phase of growth across Nigeria.</p></div><div className="mt-10"><AboutContactForm /></div></div><div className="mx-auto mt-20 flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-dark/10 pt-8 md:flex-row"><div className="flex items-center gap-3"><Image src="/Tas Logo-green.png" alt="TAS Logo" width={40} height={40} className="h-10 w-10 rounded-full" /><p className="font-body text-sm font-medium text-dark/50">Tech and Sun © 2026.</p></div><div className="flex items-center gap-4"><a href="https://x.com/techandsunhubs" target="_blank" rel="noopener noreferrer" aria-label="Tech and Sun on X" className="text-dark/40 transition-colors hover:text-primary"><Twitter className="h-7 w-7" /></a><a href="https://www.linkedin.com/company/tech-and-sun/" target="_blank" rel="noopener noreferrer" aria-label="Tech and Sun on LinkedIn" className="text-dark/40 transition-colors hover:text-primary"><Linkedin className="h-7 w-7" /></a><a href="https://www.youtube.com/@TechandSunHubs" target="_blank" rel="noopener noreferrer" aria-label="Tech and Sun on YouTube" className="text-dark/40 transition-colors hover:text-primary"><Youtube className="h-7 w-7" /></a></div></div></footer>
        </>
    );
}
