"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AnimatedLines } from "../ui/AnimatedLines";
import { X } from "lucide-react";
import Image from "next/image";

interface Hub {
    id: string;
    name: string;
    location: string;
    image: string;
    status: string;
    statusColor: string;
    dotColor: string;
    border: string;
    overlay: string;
    textColor: string;
    summary: string;
    description: string;
}

export default function Localism() {
    // Modal State
    const [selectedHub, setSelectedHub] = useState<Hub | null>(null);

    const hubs: Hub[] = [
        {
            id: "awka",
            name: "TAS Hub Awka",
            location: "Awka, near UNIZIK's Coke Center",
            image: "/Akwahub.png",
            status: "Active",
            statusColor: "text-emerald-600 bg-white/90 border-emerald-500/20",
            dotColor: "bg-emerald-500",
            border: "border-accent/20",
            overlay: "bg-accent/20",
            textColor: "text-primary",
            summary: "Our live pilot hub in Awka, near UNIZIK, gives students and builders a dependable base for learning, collaboration, and early-stage community projects.",
            description: "TAS Hub Awka is our live pilot location near Nnamdi Azikiwe University in Awka. It brings together dependable solar power, internet access, and a shared space where students and builders can learn together, test ideas, and work on projects with local relevance.",
        },
        {
            id: "enugu",
            name: "Planned TAS Hub Enugu",
            location: "Enugu, Nigeria",
            image: "/enuguhub.png",
            status: "Coming Soon",
            statusColor: "text-white/70 bg-dark/80 border-white/10",
            dotColor: "hidden",
            border: "border-primary/20",
            overlay: "bg-primary/20",
            textColor: "text-accent",
            summary: "Enugu is a planned expansion location. Site, timing, and capacity remain subject to confirmation before the hub is presented as active.",
            description: "TAS is exploring Enugu as a future university-centered hub. The location is not yet operating, and launch timing, site details, and capacity will be published only after they are confirmed."
        }
    ];

    return (
        <section
            id="hubs"
            className="relative flex scroll-mt-24 flex-col items-center justify-center overflow-hidden bg-white px-4 py-16 md:py-24"
        >
            <AnimatedLines />
            {/* Static Background Visuals */}
            <div className="absolute left-[-10%] top-[20%] h-[500px] w-[500px] rounded-full border-[40px] border-vibrant/20 blur-sm pointer-events-none" />
            <div className="absolute right-[-5%] bottom-[-10%] h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute left-[20%] bottom-[10%] h-32 w-32 rounded-3xl rotate-12 bg-accent/10 blur-xl pointer-events-none" />

            <div className="mb-16 text-center relative z-10 w-full px-4">
                <h2 className="font-heading text-5xl md:text-6xl font-bold text-dark mb-4">
                    Our Hubs
                </h2>
                <p className="font-body text-lg text-dark/70 max-w-2xl mx-auto">
                    TAS is building dependable hubs across Nigerian universities,
                    creating the foundation to grow this model across states and
                    regions as more communities come on board.
                </p>
            </div>

            <div className="container mx-auto grid max-w-5xl items-stretch gap-8 md:grid-cols-2 md:gap-16">
                {hubs.map((hub) => (
                    <motion.button
                        type="button"
                        key={hub.id}
                        onClick={() => setSelectedHub(hub)}
                        className={`group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border ${hub.border} bg-white text-left shadow-2xl cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}
                    >
                        <div className="aspect-[4/3] w-full bg-dark/5 relative overflow-hidden shrink-0">
                            <Image src={hub.image} alt={hub.name} fill className="object-cover" />
                            <div className={`absolute inset-0 ${hub.overlay} mix-blend-multiply group-hover:bg-transparent transition-colors duration-500`}></div>

                            {/* Status Indicator */}
                            <div className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full backdrop-blur-sm px-3 py-1 shadow-sm border ${hub.statusColor}`}>
                                {hub.dotColor !== 'hidden' && (
                                    <span className="relative flex h-2 w-2">
                                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${hub.dotColor}`}></span>
                                        <span className={`relative inline-flex h-2 w-2 rounded-full ${hub.dotColor}`}></span>
                                    </span>
                                )}
                                <span className="text-[10px] font-black uppercase tracking-widest">{hub.status}</span>
                            </div>
                        </div>
                        <div className="p-8 relative z-10 bg-white flex-grow flex flex-col justify-start">
                            <h3 className={`mb-2 font-heading text-3xl font-bold ${hub.textColor}`}>
                                {hub.name}
                            </h3>
                            <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.18em] text-dark/45">
                                {hub.location}
                            </p>
                            <p className="font-body text-dark/80">
                                {hub.summary}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Modal for Details */}
            <AnimatePresence>
                {selectedHub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm"
                        onClick={() => setSelectedHub(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 30, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="h-48 md:h-64 w-full relative shrink-0">
                                <Image src={selectedHub.image} alt={selectedHub.name} fill className="object-cover" />
                                <div className={`absolute inset-0 ${selectedHub.overlay} mix-blend-multiply`}></div>
                                <button
                                    onClick={() => setSelectedHub(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-dark/40 text-white hover:bg-dark/60 backdrop-blur-md transition-colors"
                                    aria-label="Close hub details"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                <div className={`absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full backdrop-blur-md px-3 py-1 shadow-md border ${selectedHub.statusColor}`}>
                                    {selectedHub.dotColor !== 'hidden' && (
                                        <span className="relative flex h-2 w-2">
                                            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${selectedHub.dotColor}`}></span>
                                            <span className={`relative inline-flex h-2 w-2 rounded-full ${selectedHub.dotColor}`}></span>
                                        </span>
                                    )}
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{selectedHub.status}</span>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 overflow-y-auto">
                                <h3 className={`font-heading text-4xl font-bold mb-4 ${selectedHub.textColor}`}>
                                    {selectedHub.name}
                                </h3>

                                <p className="mb-4 font-body text-sm font-bold uppercase tracking-[0.18em] text-dark/45">
                                    {selectedHub.location}
                                </p>

                                <p className="font-body text-lg text-dark/80 leading-relaxed mb-8">
                                    {selectedHub.description}
                                </p>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
