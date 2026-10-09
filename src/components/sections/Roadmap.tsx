"use client";

import { motion } from "framer-motion";

const milestones = [
    {
        id: 1,
        quarter: "Q1 2026",
        title: "Launch the first TAS hub at UNIZIK with dependable power, internet, and a home base for builders",
        badge: "border-primary/20 bg-primary/10 text-primary",
        dot: "bg-primary"
    },
    {
        id: 2,
        quarter: "Q2 2026",
        title: "Launch learning programs at the Awka hub and strengthen the operating model for future locations",
        badge: "border-accent/20 bg-accent/10 text-accent",
        dot: "bg-accent"
    },
    {
        id: 3,
        quarter: "Q3 2026",
        title: "Prepare the next hub locations, including Enugu and Abuja, through site, partner, and funding readiness",
        badge: "border-secondary/30 bg-secondary/40 text-dark",
        dot: "bg-secondary"
    },
    {
        id: 4,
        quarter: "Q4 2026",
        title: "Deepen partnerships with local energy providers and businesses to strengthen long-term foundations",
        badge: "border-dark/10 bg-dark/5 text-dark",
        dot: "bg-dark"
    },
];

export default function Roadmap() {
    return (
        <section
            id="roadmap"
            className="relative overflow-hidden bg-vibrant px-4 py-24 scroll-mt-24 md:py-28"
        >
            <div className="pointer-events-none absolute left-[-8%] top-20 h-[360px] w-[360px] rounded-full bg-primary/8 blur-[110px]" />
            <div className="pointer-events-none absolute bottom-0 right-[-6%] h-[280px] w-[280px] rounded-full bg-secondary/20 blur-[90px]" />

            <div className="relative mx-auto max-w-6xl">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="mb-5 font-heading text-5xl font-bold text-dark md:text-7xl">
                        2026 Roadmap
                    </h2>
                    <p className="font-body text-lg text-dark/65">
                        A grounded path from the live Awka hub toward a broader network of
                        university-based hubs across Nigeria.
                    </p>
                </div>

                <div
                    data-testid="roadmap-desktop"
                    className="relative hidden md:block"
                >
                    <div className="absolute left-[8%] right-[8%] top-8 h-px bg-dark/10" />
                    <div className="grid grid-cols-4 gap-6">
                        {milestones.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                                className="relative pt-16"
                            >
                                <div className={`absolute left-1/2 top-[26px] h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white shadow-sm ${item.dot}`} />
                                <div className="h-full rounded-[2rem] border border-dark/10 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                                    <span className={`inline-flex rounded-full border px-4 py-1 text-xs font-black uppercase tracking-[0.22em] ${item.badge}`}>
                                        {item.quarter}
                                    </span>
                                    <p className="mt-5 font-heading text-2xl font-bold leading-snug text-dark">
                                        {item.title}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div
                    data-testid="roadmap-mobile"
                    className="relative space-y-4 md:hidden"
                >
                    <div className="absolute bottom-4 left-[19px] top-4 w-px bg-dark/10" />
                    {milestones.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.4, delay: index * 0.06 }}
                            className="relative pl-12"
                        >
                            <div className={`absolute left-3 top-7 h-4 w-4 rounded-full border-4 border-white shadow-sm ${item.dot}`} />
                            <div className="rounded-[1.75rem] border border-dark/10 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                                <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${item.badge}`}>
                                    {item.quarter}
                                </span>
                                <p className="mt-4 font-heading text-2xl font-bold leading-snug text-dark">
                                    {item.title}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
