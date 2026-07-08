"use client";

import { motion } from "framer-motion";
import { Twitter, Github } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

const floatingIconCards = [
    {
        id: "Nodes",
        title: "Ethereum Staking",
        icon: "/Node.png", // Using Node.png as requested for custom icons
        position: { top: "10%", right: "350px" },
        delay: 0,
        floatDuration: 3.2,
    },
    {
        id: "Starlink",
        title: "Internet",
        icon: "/Internet (Starlink) green.png",
        position: { top: "5%", right: "50px" },
        delay: 0.5,
        floatDuration: 4.1,
    },
    {
        id: "solar",
        title: "Solar Energy",
        icon: "/Solar Panel.png",
        position: { top: "45%", right: "350px" },
        delay: 1,
        floatDuration: 3.6,
    },
    {
        id: "power",
        title: "Energy Storage",
        icon: "/Battery.png",
        position: { top: "47%", right: "30px" },
        delay: 1.5,
        floatDuration: 4.4,
    },
];

// Helper for paths to the turbine hub (rough approximations based on layout)
function getTurbinePath(id: string) {
    // Hub relative to card center (approximate deltas)
    switch (id) {
        case 'Nodes': return "M 300 250 Q 400 300 480 380";
        case 'Starlink': return "M 300 250 Q 250 300 180 380";
        case 'solar': return "M 300 250 Q 400 200 480 120";
        case 'power': return "M 300 250 Q 250 200 160 120";
        default: return "M 300 250 L 350 300";
    }
}

export default function Hero() {
    const turbineRef = useRef<HTMLDivElement>(null);

    return (
        <section
            id="hero"
            data-testid="hero-section"
            className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#A5D5F5] to-[#E5F1FF] scroll-mt-24"
        >
            {/* Navigation */}
            <header className="absolute top-0 left-0 right-0 z-50 w-full">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 md:py-10">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/Tas Logo-green.png"
                            alt="TAS Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full md:h-12 md:w-12 lg:h-14 lg:w-14"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="https://x.com/techandsunhubs" target="_blank" rel="noopener noreferrer" className="text-dark/60 hover:text-primary transition-colors">
                            <Twitter className="h-7 w-7" />
                        </a>
                        <a href="https://github.com/Greenpill9ja" target="_blank" rel="noopener noreferrer" className="text-dark/60 hover:text-primary transition-colors">
                            <Github className="h-7 w-7" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Sun Illustration */}
            <div id="hero-sun" className="absolute top-10 left-1/2 -translate-x-1/2 z-0">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-secondary-400/30 blur-3xl rounded-full" />
                    <Image src="/sun.png" alt="Sun" width={288} height={288} className="h-48 w-48 md:h-72 md:w-72 brightness-110" />
                </motion.div>
            </div>

            {/* Main Content Layout */}
            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 pb-28 pt-20 md:pb-0">
                <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

                    {/* Left Column: Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl pb-10 md:pb-0 lg:-translate-y-12"
                    >
                        <h1 className="font-heading text-[2.9rem] font-black leading-[1.02] text-dark sm:text-5xl md:text-5xl lg:text-[3.75rem]">
                            Tech and Sun <br />
                            <span className="text-primary">Empowering</span> <br />
                            Builders and Communities
                        </h1>

                        <p className="mt-3 max-w-lg font-body text-base font-medium leading-relaxed text-dark/80 md:mt-6 md:text-base lg:text-lg">
                            TAS builds dependable solar-powered hubs that give students,
                            builders, and local communities in Nigeria steady access to
                            electricity and internet providing a space to learn, build,
                            and grow together.
                        </p>

                        {/* <div className="mt-12 flex flex-col gap-1">
                            <span className="text-4xl font-black text-dark tracking-tighter">30<sup className="text-xl">+</sup></span>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-dark/40">Years of Experience</span>
                        </div> */}
                    </motion.div>

                    {/* Right Column: Turbine and Floating Icons */}
                    <div className="relative hidden h-[600px] lg:block">
                        {/* Wind Turbine Illustration */}
                        <div ref={turbineRef} className="absolute inset-0 flex items-center justify-end">
                            <div className="relative h-full w-full">
                                {/* The "Hub" point for connections */}
                                <div id="turbine-hub" className="absolute left-[72%] top-[31%] z-30 h-4 w-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />

                                {/* TAS */}
                                <Image
                                    src="/tashub.png"
                                    alt="TAS Hub"
                                    fill
                                    className="absolute bottom-0 right-0 object-contain opacity-90 brightness-110 [mask-image:radial-gradient(circle_at_center,black_40%,transparent_90%)]"
                                />
                            </div>
                        </div>

                        {/* Floating Cards */}
                        {floatingIconCards.map((card) => (
                            <motion.div
                                key={card.id}
                                style={{ top: card.position.top, right: card.position.right }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -15, 0]
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: card.delay,
                                    y: {
                                        duration: card.floatDuration,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                className="absolute z-20 flex flex-col items-center gap-2"
                            >
                                <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-vibrant/40 p-1 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/60 shadow-xl">
                                    <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-white/50">
                                        <Image src={card.icon} alt={card.title} width={96} height={64} className="h-full w-full object-contain p-1.5" />
                                    </div>
                                    <div className="py-1 text-center">
                                        <span className="text-[8px] font-black uppercase text-dark/70 tracking-tight whitespace-nowrap">{card.title}</span>
                                    </div>
                                </div>

                                {/* Connecting Dotted Line to Hub */}
                                <svg className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible">
                                    <motion.path
                                        d={getTurbinePath(card.id)}
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="2"
                                        strokeDasharray="6 6"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, delay: card.delay + 0.5 }}
                                    />
                                    <motion.circle
                                        r="3"
                                        fill="white"
                                        className="shadow-sm"
                                        animate={{
                                            offsetDistance: ["0%", "100%"],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: card.delay
                                        }}
                                        style={{ offsetPath: `path("${getTurbinePath(card.id)}")` }}
                                    />
                                </svg>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Partners Section - Looping Animation */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="mx-auto max-w-6xl rounded-t-[40px] bg-white/60 px-5 py-6 shadow-[0_-20px_50px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-colors duration-500 hover:bg-white sm:px-6 md:px-8 md:py-10">
                    <div className="flex flex-col items-center justify-between gap-6 md:gap-8 md:flex-row">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-dark/70 whitespace-nowrap md:gap-4 md:text-sm md:tracking-[0.3em]">
                            <div className="h-px w-6 bg-dark/80" />
                            Strategic Partners
                        </div>

                        <div className="relative flex flex-1 overflow-hidden">
                            <motion.div
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 20,
                                }}
                                className="flex w-max items-center gap-8 pr-8 md:gap-16 md:pr-12"
                            >
                                {/* First Set */}
                                {[
                                    { name: "Greenpill Network", logo: "/greenpill-network.png" },
                                    { name: "Greenpill Nigeria", logo: "/greenpillnaija.png" },
                                    { name: "Greenpill Dev Guild", logo: "/Dev-Guild.png" },
                                    { name: "Localism", logo: "/Localism.png" },
                                    { name: "M3tering Protocol", logo: "/m3tering protocol.png" },
                                    { name: "Switch Electric", logo: "/switch.png" }
                                ].map((partner, idx) => (
                                    <div key={`p1-${idx}`} className="group flex flex-nowrap items-center gap-3 transition-all md:gap-4">
                                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-dark/10 bg-gray-50 p-1 shadow-sm md:h-10 md:w-10">
                                            <Image src={partner.logo} alt={partner.name} width={40} height={40} className="h-full w-full object-contain" />
                                        </div>
                                        <span className="font-heading text-base font-extrabold tracking-tight text-dark/70 transition-colors group-hover:text-dark whitespace-nowrap md:text-xl">{partner.name}</span>
                                    </div>
                                ))}
                                {/* Second Set for seamless loop */}
                                {[
                                    { name: "Greenpill Network", logo: "/greenpill-network.png" },
                                    { name: "Greenpill Nigeria", logo: "/greenpillnaija.png" },
                                    { name: "Greenpill Dev Guild", logo: "/Dev-Guild.png" },
                                    { name: "Localism", logo: "/Localism.png" },
                                    { name: "M3tering Protocol", logo: "/m3tering protocol.png" },
                                    { name: "Switch Electric", logo: "/switch.png" }
                                ].map((partner, idx) => (
                                    <div key={`p2-${idx}`} className="group flex flex-nowrap items-center gap-3 transition-all md:gap-4">
                                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-dark/10 bg-gray-50 p-1 shadow-sm md:h-10 md:w-10">
                                            <Image src={partner.logo} alt={partner.name} width={40} height={40} className="h-full w-full object-contain" />
                                        </div>
                                        <span className="font-heading text-base font-extrabold tracking-tight text-dark/70 transition-colors group-hover:text-dark whitespace-nowrap md:text-xl">{partner.name}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
