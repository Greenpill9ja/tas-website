"use client";

import { motion } from "framer-motion";
import { ExternalLink, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

type StackItem = {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    resourceUrl: string;
    resourceLabel: string;
};

const parts: StackItem[] = [
    {
        id: "green-goods",
        name: "Green Goods",
        icon: "/Hub-icon.png",
        color: "border border-primary/20 bg-vibrant/85 text-dark backdrop-blur",
        description: "A lightweight tool for documenting hub development, sessions, workshops, and the day-to-day activity happening in the space.",
        resourceUrl: "https://www.greengoods.app/",
        resourceLabel: "Explore Green Goods"
    },
    {
        id: "ethereum-staking-node",
        name: "Ethereum Staking Node",
        icon: "/Node.png",
        color: "bg-dark text-white",
        description: "On-site Ethereum staking infrastructure that helps secure the network while creating a revenue stream for hub operations.",
        resourceUrl: "https://ethereum.org/staking/",
        resourceLabel: "Learn about Ethereum staking"
    },
    {
        id: "starlink-internet",
        name: "Starlink Internet",
        icon: "/Internet (Starlink) green.png",
        color: "bg-accent text-white",
        description: "Dedicated Starlink connectivity that gives the hub reliable internet for classes, research, coordination, and project work.",
        resourceUrl: "https://www.starlink.com/",
        resourceLabel: "Learn about Starlink"
    },
    {
        id: "energy-storage",
        name: "Energy Storage",
        icon: "/Battery.png",
        color: "bg-primary text-white",
        description: "Battery storage that carries the hub through outages and evening hours so learning and work do not stop when the grid does.",
        resourceUrl: "https://www.energy.gov/energysaver/battery-storage",
        resourceLabel: "Learn about battery storage"
    },
    {
        id: "solar-energy",
        name: "Solar Energy",
        icon: "/Solar Panel.png",
        color: "bg-secondary text-dark",
        description: "Primary solar generation for the hub, sized to keep the space running through daily use and changing weather conditions.",
        resourceUrl: "https://www.energy.gov/energysaver/solar-energy",
        resourceLabel: "Learn about solar energy"
    },
];

export default function TheStack() {
    const [selectedItem, setSelectedItem] = useState<StackItem | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openDialog = (item: StackItem) => {
        setSelectedItem(item);
        dialogRef.current?.showModal();
    };

    const closeDialog = () => {
        dialogRef.current?.close();
        setSelectedItem(null);
    };

    return (
        <section
            id="stack"
            className="relative flex w-full scroll-mt-24 flex-col items-center justify-center overflow-hidden bg-white/50 px-4 py-24"
        >
            <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center">
                <div className="z-10 mb-16 w-full px-4 pt-10 text-center">
                    <h2 className="mb-4 font-heading text-5xl font-bold text-dark drop-shadow-sm md:text-7xl">
                        The Stack
                    </h2>
                    <p className="mx-auto max-w-2xl font-body text-xl text-dark/70">
                        The systems that keep each TAS hub powered, connected, and documented.
                    </p>
                </div>

                <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-6">
                    {parts.map((item, i) => (
                        <motion.button
                            type="button"
                            key={item.id}
                            data-testid={`stack-card-${item.id}`}
                            onClick={() => openDialog(item)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            whileHover={{ scale: 1.015 }}
                            className={`relative flex min-h-64 w-full flex-col justify-between rounded-3xl border border-black/5 p-6 text-left shadow-xl transition-transform transition-shadow hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""} ${i === 4 ? "lg:col-start-4" : ""} ${item.color}`}
                        >
                            <div className="absolute right-4 top-4 flex items-center gap-2">
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 shadow-sm backdrop-blur-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                </motion.div>
                            </div>

                            <div className="mb-6 flex">
                                <div className="flex rounded-2xl bg-white/20 p-4 shadow-inner">
                                    <Image src={item.icon} alt={item.name} width={48} height={48} className="h-12 w-12 object-contain" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="pr-10 font-heading text-2xl font-bold leading-tight">
                                    {item.name}
                                </div>
                                <p className="font-body text-sm leading-relaxed opacity-85">
                                    {item.description}
                                </p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <dialog
                ref={dialogRef}
                closedby="any"
                aria-labelledby="stack-dialog-title"
                onClose={() => setSelectedItem(null)}
                className="m-auto w-11/12 max-w-xl overflow-hidden rounded-3xl border border-dark/15 bg-white p-0 shadow-2xl backdrop:bg-dark/40 backdrop:backdrop-blur-sm"
            >
                {selectedItem && (
                    <div>
                        <div className="relative flex items-start gap-4 border-b border-dark/10 bg-vibrant p-6 pr-16 md:p-8 md:pr-20">
                            <div className="rounded-2xl bg-white p-3 shadow-sm">
                                <Image src={selectedItem.icon} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
                            </div>
                            <div>
                                <p className="font-body text-xs font-bold uppercase tracking-widest text-primary">TAS hub stack</p>
                                <h3 id="stack-dialog-title" className="mt-2 font-heading text-3xl font-bold text-dark">
                                    {selectedItem.name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={closeDialog}
                                aria-label={`Close ${selectedItem.name} details`}
                                className="absolute right-6 top-6 rounded-full border border-dark/10 bg-white p-2 text-dark/70 shadow-sm transition-colors hover:bg-dark/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="font-body text-lg leading-relaxed text-dark/80">
                                {selectedItem.description}
                            </p>
                            <a
                                href={selectedItem.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-light-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                            >
                                {selectedItem.resourceLabel}
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                )}
            </dialog>

        </section>
    );
}
