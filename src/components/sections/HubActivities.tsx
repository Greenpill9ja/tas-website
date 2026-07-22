"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ExternalLink, X, Users, Clock, User, Award, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface EventDetail {
    host: string;
    attendance: string;
    duration: string;
    outcome: string;
    lumaLink?: string;
}

interface ActivityEvent {
    id: number;
    title: string;
    date: string;
    location: string;
    type: "Bootcamp" | "Workshop" | "Launch" | "Community" | "Summit" | "Hackathon";
    status: "past" | "present" | "future";
    description: string;
    details: EventDetail;
}

export default function HubActivities() {
    const [activeTab, setActiveTab] = useState<"all" | "past" | "present" | "future">("all");
    const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const events: ActivityEvent[] = [
        {
        id: 1,
        title: "The TAS Hub Activation",
        date: "March 14, 2026",
        location: "TAS Hub Awka, Coke Center (UNIZIK)",
        type: "Launch",
        status: "past",
        description: "The formal rollout and commissioning of the solar-powered infrastructure hub. Connecting the 580W mono-crystalline array and Starlink network to provide a stable, off-grid learning base for students.",
        details: {
            host: "Greenpill Nigeria & Switch Electric",
            attendance: "150+ students, tech builders & faculty",
            duration: "1 Day (Launch & Network Sync)",
            outcome: "Successfully powered up the core 40ft/20ft hybrid container system, deployed the local subnet, and launched the public workspace.",
            lumaLink: "[https://luma.com/Greenpillnaija?period=past](https://luma.com/Greenpillnaija?period=past)"
        }
    },
    {
        id: 2,
        title: "Intro to Web3 with Hfuture",
        date: "April 10, 2026",
        location: "TAS Hub UNN (Enugu Hub)",
        type: "Workshop",
        status: "past",
        description: "An intensive fundamental crash course co-hosted with Hfuture to bridge local university tech enthusiasts into the decentralized space, setting up wallets and running smart contract demos.",
        details: {
            host: "Hfuture Partner Network & TAS Mentors",
            attendance: "85 active participants",
            duration: "6 Hours (Intensive)",
            outcome: "Created 60+ new active Ethereum accounts on-chain, completed interactive baseline dApp testing, and selected 15 students for the developer fast-track.",
            lumaLink: "[https://luma.com/Greenpillnaija?period=past](https://luma.com/Greenpillnaija?period=past)"
        }
    },
    {
        id: 3,
        title: "The Earth Day Celebration",
        date: "April 22, 2026",
        location: "TAS Hubs (Awka & Enugu Hybrid)",
        type: "Community",
        status: "past",
        description: "A convergence focused on Regenerative Finance (ReFi) and local environmental impact. Demonstrating how solar generation tracking directly creates verifiable public goods.",
        details: {
            host: "Greenpill Network Global & Regenerative Localism Fund",
            attendance: "110+ environmental & tech advocates",
            duration: "4 Hours",
            outcome: "Mapped local carbon mitigation metrics directly from the Switch Smart Meter telemetry data and distributed Gitcoin impact badges.",
            lumaLink: "[https://luma.com/Greenpillnaija?period=past](https://luma.com/Greenpillnaija?period=past)"
        }
    },
    {
        id: 4,
        title: "Content Creation Bootcamp",
        date: "May 18 - June 05, 2026",
        location: "TAS Hub Awka Lab",
        type: "Bootcamp",
        status: "past",
        description: "Empowering local student creators with production, brand development, and Web3 storytelling technical skills to natively document regional digital public goods development.",
        details: {
            host: "Greenpill Dev Guild Media Team",
            attendance: "45 curated content creators",
            duration: "3 Weeks",
            outcome: "Produced 12 student-led video logs focusing on solar deployment, onboarding 200+ online community followers to @techandsunhubs.",
            lumaLink: "[https://luma.com/Greenpillnaija?period=past](https://luma.com/Greenpillnaija?period=past)"
        }
    },
    {
        id: 5,
        title: "Product Design Bootcamp",
        date: "July 01 - Ongoing",
        location: "Hybrid (TAS Hub Enugu & Virtual Workspace)",
        type: "Bootcamp",
        status: "present",
        description: "Active high-fidelity training cohort focusing on user experience layout design for regenerative tech applications, local telemetry dashboards, and the Greenpayer app ecosystem.",
        details: {
            host: "TAS Lead Creative Technologists",
            attendance: "65 active designers in training",
            duration: "6 Weeks (Ongoing)",
            outcome: "Active Cohort. Students are currently creating accessible UI/UX components tailored for low-bandwidth environments using Space Grotesk and Inter standards.",
            lumaLink: "[https://luma.com/Greenpillnaija](https://luma.com/Greenpillnaija)"
        }
    }
];

    const filteredEvents = events.filter(
        (event) => activeTab === "all" || event.status === activeTab
    );

    const openDialog = (event: ActivityEvent) => {
        setSelectedEvent(event);
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        setSelectedEvent(null);
    };

    // Click outside fallback for Safari/older browsers
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (!("closedBy" in HTMLDialogElement.prototype)) {
                if (e.target !== dialog) return;

                const rect = dialog.getBoundingClientRect();
                const isDialogContent = (
                    rect.top <= e.clientY &&
                    e.clientY <= rect.top + rect.height &&
                    rect.left <= e.clientX &&
                    e.clientX <= rect.left + rect.width
                );

                if (isDialogContent) return;
                dialog.close();
                setSelectedEvent(null);
            }
        };

        dialog.addEventListener("click", handleOutsideClick);
        return () => {
            dialog.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <section id="activities" className="relative w-full overflow-hidden bg-white py-16 md:py-24 px-4 border-t border-dark/5">
            <div className="container relative z-10 mx-auto">
                {/* Header Area */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-4 drop-shadow-sm">
                            Hub Activities & Education
                        </h2>
                        <p className="font-body text-lg text-dark/70 max-w-xl">
                            Explore our educational bootcamps, workshops, and event history tracking the growth of off-grid solar-and-builder communities.
                        </p>
                    </div>
                    <a
                        href="https://luma.com/Greenpillnaija?period=past"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-6 py-3 font-heading text-sm font-bold transition-all hover:bg-primary hover:text-white"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        View Full Calendar <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                {/* Tab Filtering Controls */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-dark/10 pb-4">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-5 py-2.5 rounded-full font-heading text-sm font-bold transition-all border cursor-pointer ${
                            activeTab === "all"
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-dark/75 hover:bg-dark/5 border-dark/10"
                        }`}
                    >
                        All Activities
                    </button>
                    <button
                        onClick={() => setActiveTab("present")}
                        className={`px-5 py-2.5 rounded-full font-heading text-sm font-bold transition-all border cursor-pointer ${
                            activeTab === "present"
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-dark/75 hover:bg-dark/5 border-dark/10"
                        }`}
                    >
                        Live / Ongoing
                    </button>
                    <button
                        onClick={() => setActiveTab("future")}
                        className={`px-5 py-2.5 rounded-full font-heading text-sm font-bold transition-all border cursor-pointer ${
                            activeTab === "future"
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-dark/75 hover:bg-dark/5 border-dark/10"
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`px-5 py-2.5 rounded-full font-heading text-sm font-bold transition-all border cursor-pointer ${
                            activeTab === "past"
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-dark/75 hover:bg-dark/5 border-dark/10"
                        }`}
                    >
                        History (Past)
                    </button>
                </div>

                {/* Events Horizontal Scroll/Grid container */}
                <div className="flex items-stretch overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {filteredEvents.map((activity, idx) => {
                        const bgIcons = ["/Solar Panel.png", "/Battery.png", "/Node.png", "/Internet (Starlink).png"];
                        const bgIcon = bgIcons[idx % bgIcons.length];

                        return (
                            <motion.div
                                key={activity.id}
                                whileHover={{ y: -5 }}
                                onClick={() => openDialog(activity)}
                                className="relative overflow-hidden w-[calc(100vw-2rem)] max-w-[320px] md:max-w-none md:w-[400px] snap-center flex-shrink-0 self-stretch h-auto bg-vibrant p-6 md:p-8 rounded-3xl border border-primary/20 shadow-sm hover:shadow-xl transition-shadow flex flex-col"
                            >
                                {/* Faint Card Background Icon */}
                                <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 grayscale pointer-events-none rotate-12">
                                    <Image src={bgIcon} alt="" width={128} height={128} className="w-full h-full object-contain" />
                                </div>

                                <div className="relative z-10 flex justify-between items-start mb-4 md:mb-6">
                                    <span className="inline-block px-3 py-1 rounded-full bg-white text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/10 shadow-sm">
                                        {activity.type}
                                    </span>
                                    <div className="flex items-center gap-1.5 md:gap-2 text-dark/50 text-xs md:text-sm font-medium">
                                        <Calendar className="w-4 h-4" />
                                        {activity.date}
                                    </div>
                                </div>

                                <h3 className="relative z-10 font-heading text-xl md:text-2xl font-bold text-dark mb-2 md:mb-3">
                                    {activity.title}
                                </h3>

                                <p className="relative z-10 font-body text-sm md:text-base text-dark/70 mb-6 md:mb-8 flex-grow">
                                    {activity.description}
                                </p>

                                <div className="relative z-10 mt-auto pt-4 border-t border-dark/10 flex justify-between items-center">
                                    <span className="font-bold text-xs md:text-sm text-dark/60 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {activity.location.split(",")[0]}
                                    </span>
                                    <span className="text-primary text-xs font-bold hover:underline">
                                        View Details &rarr;
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}

                    {filteredEvents.length === 0 && (
                        <div className="w-full text-center py-12 text-dark/50 font-body">
                            No activities currently listed in this category.
                        </div>
                    )}
                </div>
            </div>

            {/* Native Dialog Component for Detailed Event Popup */}
            <dialog
                ref={dialogRef}
                closedby="any"
                aria-labelledby="dialog-title"
                className="rounded-3xl border border-dark/15 bg-white p-0 shadow-2xl overflow-hidden max-w-2xl w-11/12 outline-none"
            >
                {selectedEvent && (
                    <div className="flex flex-col">
                        {/* Event Header with Status Badge */}
                        <div className="relative bg-vibrant p-6 md:p-8 border-b border-dark/10 flex justify-between items-start pr-16">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-white text-xs font-bold uppercase tracking-wider text-primary border border-primary/10 shadow-sm mb-3">
                                    {selectedEvent.type}
                                </span>
                                <h3 id="dialog-title" className="font-heading text-2xl md:text-3xl font-bold text-dark leading-tight">
                                    {selectedEvent.title}
                                </h3>
                            </div>
                            <button
                                onClick={closeDialog}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white border border-dark/10 text-dark/70 hover:bg-dark/5 hover:text-dark transition-colors shadow-sm cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Event Details Content */}
                        <div className="p-6 md:p-8 overflow-y-auto dialog-content">
                            {/* Real Telemetry / Outcome Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-vibrant/40 p-4 rounded-2xl border border-primary/5 flex items-start gap-3">
                                    <User className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block text-xs font-bold text-dark/50 uppercase tracking-wider">Host</span>
                                        <span className="font-body text-sm font-semibold text-dark/80">{selectedEvent.details.host}</span>
                                    </div>
                                </div>
                                <div className="bg-vibrant/40 p-4 rounded-2xl border border-primary/5 flex items-start gap-3">
                                    <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block text-xs font-bold text-dark/50 uppercase tracking-wider">Attendance</span>
                                        <span className="font-body text-sm font-semibold text-dark/80">{selectedEvent.details.attendance}</span>
                                    </div>
                                </div>
                                <div className="bg-vibrant/40 p-4 rounded-2xl border border-primary/5 flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block text-xs font-bold text-dark/50 uppercase tracking-wider">Duration</span>
                                        <span className="font-body text-sm font-semibold text-dark/80">{selectedEvent.details.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Outcome Statement Highlight Box */}
                            <div className="mb-6 bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl border-y border-r border-primary/10">
                                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                                    <Award className="w-4 h-4" />
                                    {selectedEvent.status === "past" ? "Key Outcomes & Impact" : "Objectives & Expected Outcome"}
                                </h4>
                                <p className="font-body text-sm md:text-base text-dark/95 leading-relaxed font-medium">
                                    {selectedEvent.details.outcome}
                                </p>
                            </div>

                            {/* Full Description */}
                            <div className="mb-8">
                                <h4 className="font-heading text-xs font-bold text-dark/50 uppercase tracking-wider mb-2">Description</h4>
                                <p className="font-body text-sm md:text-base text-dark/80 leading-relaxed">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            {/* Modal Footer / Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-dark/10">
                                <div className="text-dark/50 text-xs font-semibold flex items-center gap-1 sm:mr-auto py-2 sm:py-0">
                                    <MapPin className="w-4 h-4" />
                                    {selectedEvent.location}
                                </div>
                                <button
                                    onClick={closeDialog}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-full font-heading text-sm font-bold text-dark/70 hover:bg-dark/5 transition-all border border-dark/10 cursor-pointer"
                                >
                                    Close
                                </button>
                                {selectedEvent.details.lumaLink && (
                                    <a
                                        href={selectedEvent.details.lumaLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto bg-primary hover:bg-light-green text-white font-heading text-sm font-bold px-6 py-2.5 rounded-full inline-flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                    >
                                        {selectedEvent.status === "future" ? "Register on Luma" : "View Event Page"}
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </dialog>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                #activities .snap-center {
                    cursor: pointer;
                }

                /* Dialog overlay / backdrop styling */
                dialog::backdrop {
                    background-color: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(8px);
                }

                .dialog-content {
                    max-height: 70vh;
                }
            `}} />
        </section>
    );
}


