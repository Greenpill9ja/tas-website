"use client";

import { Twitter, Linkedin, Youtube } from "lucide-react";
import { useActionState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import Image from "next/image";

type TeamMember = {
    slug: string;
    name: string;
    role: string;
    image?: string;
    twitter?: string;
    linkedin?: string;
};

export default function Footer() {
    const [formState, formAction, isPending] = useActionState(
        async (_prev: { success?: boolean; error?: string } | null, formData: FormData) => {
            return submitContactForm(formData);
        },
        null
    );

    const team: TeamMember[] = [
        {
            slug: "anthony-amio",
            name: "Anthony Amio",
            role: "Director of Operations",
            image: "/amio.jpg",
            twitter: "https://x.com/amioantho",
            linkedin: "https://www.linkedin.com/in/anthony-okoye-0b801b1a5?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        },
        {
            slug: "mmeri-anosike",
            name: "Mmeri Anosike",
            role: "Infrastructure Lead",
            image: "/Nmeri.png",
            twitter: "https://x.com/BuildwithMc",
            linkedin: "https://linkedin.com/in/buildwithmc"
        },
        {
            slug: "nansel-rimsah",
            name: "Nansel Rimsah",
            role: "Developer & Comms Lead",
            image: "/nansel.jpg",
            twitter: "https://x.com/nanselrim",
            linkedin: "https://linkedin.com/in/nansel"
        },
        {
            slug: "afolabi-aiyeloja",
            name: "Afolabi Aiyeloja",
            role: "Product and Strategy Lead",
            image: "/afo.jpg",
            twitter: "https://x.com/time_is_oba",
            linkedin: "https://linkedin.com/in/afolabi-aiyeloja"
        },
        {
            slug: "matt-strachman",
            name: "Matt Strachman",
            role: "Treasury Manager",
            image: "/matt-strachman.jpeg",
            twitter: "https://x.com/MattyCompost",
            linkedin: "https://linkedin.com/in/matt-strachman"
        },
        {
            slug: "jon-ruth",
            name: "Jon Ruth",
            role: "Strategic Advisor",
            image: "/jon.jpg",
            twitter: "https://x.com/jhruth",
            linkedin: "https://linkedin.com/in/jonruth"
        },
    ];

    return (
        <footer className="relative overflow-hidden border-t border-dark/10 bg-vibrant pb-8 pt-24">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center">
                <section className="mb-16 w-full" aria-labelledby="team-heading">
                    <h2 id="team-heading" className="mb-12 font-heading text-4xl font-bold text-dark md:text-5xl">
                        Meet the team
                    </h2>

                    <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 md:gap-12">
                        {team.map((member) => (
                            <div
                                key={member.slug}
                                data-testid={`team-member-${member.slug}`}
                                className="group flex min-w-[150px] w-[calc(50%-1rem)] max-w-[190px] cursor-pointer flex-col items-center md:w-[calc(33.333%-2rem)]"
                            >
                                <div className="mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-primary/35 bg-white/30 p-2 shadow-[0_0_30px_-8px_var(--color-primary)] backdrop-blur-sm transition-transform group-hover:-translate-y-2 md:h-40 md:w-40">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="h-full w-full rounded-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                                            }}
                                        />
                                    ) : null}
                                    <div className={`${member.image ? "hidden" : ""} flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/20 font-heading text-3xl font-bold text-dark/50`}>
                                        {member.name.charAt(0)}
                                    </div>
                                </div>

                                <h3 className="font-heading text-lg font-bold text-dark md:text-xl">
                                    {member.name}
                                </h3>
                                <p className="mt-2 text-center font-body text-xs font-medium uppercase tracking-[0.14em] text-dark/60 md:text-sm">
                                    {member.role}
                                </p>

                                {(member.twitter || member.linkedin) && (
                                    <div className="mt-4 flex items-center gap-3 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                                        {member.twitter && (
                                            <a
                                                href={member.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} on X`}
                                                className="rounded-full bg-dark/5 p-2 text-dark/45 transition-colors hover:bg-primary/15 hover:text-primary"
                                            >
                                                <Twitter className="h-4 w-4" />
                                            </a>
                                        )}
                                        {member.linkedin && (
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} on LinkedIn`}
                                                className="rounded-full bg-dark/5 p-2 text-dark/45 transition-colors hover:bg-primary/15 hover:text-primary"
                                            >
                                                <Linkedin className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-16 w-full max-w-3xl" aria-label="In loving memory of Izzy">
                    <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-primary/90 px-8 py-10 text-left text-white shadow-2xl">
                        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-secondary/20 blur-[90px]" />
                        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
                            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white/15 bg-white/5 p-1">
                                <div className="relative h-full w-full overflow-hidden rounded-full bg-white/10">
                                    <Image src="/izzy.jpg" alt="Izzy" fill className="object-cover" />
                                </div>
                            </div>
                            <div>
                                <span className="inline-block rounded-full border border-secondary/20 bg-secondary/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-secondary">
                                    In Loving Memory
                                </span>
                                <h3 className="mt-4 font-heading text-3xl font-bold text-white">
                                    Obi (Izzy) Onwuzurike
                                </h3>
                                <p className="mt-2 font-body text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                                    Founder, Tech and Sun Initiative
                                </p>
                                <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-white/82">
                                    Izzy founded the Tech and Sun initiative. His vision for
                                    dependable infrastructure, learning, and community-led
                                    growth continues to shape every hub the team is building.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="contact"
                    className="mb-24 w-full max-w-2xl scroll-mt-24"
                >
                    <div className="mb-10 text-center">
                        <h2 className="font-heading text-4xl font-bold text-dark md:text-5xl">
                            Get in touch
                        </h2>
                        <p className="mx-auto mt-5 max-w-md font-body text-lg leading-relaxed text-dark/70">
                            Reach out if you want to learn more about the hubs, explore a
                            partnership, or support the next phase of growth across Nigeria.
                        </p>
                    </div>

                    {formState?.success ? (
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
                            <p className="font-heading text-xl font-bold text-primary">Message sent!</p>
                            <p className="mt-2 font-body text-dark/60">We&apos;ll be in touch soon.</p>
                        </div>
                    ) : (
                        <form className="grid gap-4 text-left" action={formAction}>
                            <label className="grid gap-2 font-body text-sm font-semibold text-dark" htmlFor="contact-name">
                                Name
                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Your name"
                                    className="rounded-2xl border border-dark/10 bg-white px-4 py-3 text-base font-normal text-dark outline-none transition-colors placeholder:text-dark/35 focus:border-primary"
                                />
                            </label>

                            <label className="grid gap-2 font-body text-sm font-semibold text-dark" htmlFor="contact-email">
                                Email
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="rounded-2xl border border-dark/10 bg-white px-4 py-3 text-base font-normal text-dark outline-none transition-colors placeholder:text-dark/35 focus:border-primary"
                                />
                            </label>

                            <label className="grid gap-2 font-body text-sm font-semibold text-dark" htmlFor="contact-message">
                                Message
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    rows={5}
                                    required
                                    placeholder="Tell us how you would like to connect."
                                    className="resize-none rounded-2xl border border-dark/10 bg-white px-4 py-3 text-base font-normal text-dark outline-none transition-colors placeholder:text-dark/35 focus:border-primary"
                                />
                            </label>

                            {formState?.error && (
                                <p className="font-body text-sm text-red-600">{formState.error}</p>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full rounded-full bg-secondary px-8 py-4 font-heading text-lg font-bold text-dark shadow-lg transition-opacity disabled:opacity-60"
                                >
                                    {isPending ? "Sending..." : "Send Message"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>

                <div className="mt-8 flex w-full flex-col items-center justify-between gap-4 border-t border-dark/10 pt-8 md:flex-row">
                    <div className="flex items-center gap-3">
                        <Image src="/Tas Logo-green.png" alt="TAS Logo" width={40} height={40} className="h-10 w-10 rounded-full" />
                        <p className="font-body text-sm font-medium text-dark/50">
                            Tech and Sun © 2026.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="https://x.com/techandsunhubs" target="_blank" rel="noopener noreferrer" className="text-dark/40 transition-colors hover:text-primary" aria-label="Twitter">
                            <Twitter className="h-7 w-7" />
                        </a>
                        
                        <a href="https://www.linkedin.com/company/tech-and-sun/" target="_blank" rel="noopener noreferrer" className="text-dark/40 transition-colors hover:text-primary" aria-label="LinkedIn">
                            <Linkedin className="h-7 w-7" />
                        </a>
                        <a href="https://www.youtube.com/@TechandSunHubs" target="_blank" rel="noopener noreferrer" className="text-dark/40 transition-colors hover:text-primary" aria-label="YouTube">
                            <Youtube className="h-7 w-7" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
