"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ExternalLink, X, Users, Clock, User, Award, MapPin } from "lucide-react";
import Image from "next/image";

interface EventDetail {
    host: string;
    attendance: string;
    duration: string;
    outcome: string;
    sourceLink?: string;
    sourceLabel?: string;
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
    const scrollContainerRef = useRef<HTMLUListElement>(null);

    const events: ActivityEvent[] = [
    {
        id: 1,
        title: "The TAS Hub Activation",
        date: "March 14, 2026",
        location: "TAS Hub Awka, Coke Center (UNIZIK)",
        type: "Launch",
        status: "past",
        description: "The formal activation of the solar-powered Awka hub as a dependable learning and collaboration space for students and local builders.",
        details: {
            host: "Tech and Sun and Switch Electric",
            attendance: "Attendance not published",
            duration: "1 Day",
            outcome: "The Awka hub was commissioned as a solar-powered base for learning, collaboration, and community projects."
        }
    },
    {
        id: 2,
        title: "Intro to Web3 with Hfuture",
        date: "April 10, 2026",
        location: "Location not published",
        type: "Workshop",
        status: "past",
        description: "A practical introduction to Web3 concepts, wallets, and decentralized applications delivered with Hfuture for university technology enthusiasts.",
        details: {
            host: "Hfuture and TAS mentors",
            attendance: "Attendance not published",
            duration: "6 Hours",
            outcome: "Participants received guided, practical exposure to wallets and decentralized applications."
        }
    },
    {
        id: 3,
        title: "The Earth Day Celebration",
        date: "April 22, 2026",
        location: "Location not published",
        type: "Community",
        status: "past",
        description: "A community programme exploring regenerative finance, environmental action, and the role of dependable solar infrastructure in local public goods.",
        details: {
            host: "Tech and Sun community",
            attendance: "Attendance not published",
            duration: "4 Hours",
            outcome: "The programme connected environmental action with practical conversations about solar infrastructure and local public goods."
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
            attendance: "Attendance not published",
            duration: "3 Weeks",
            outcome: "Participants developed practical production, brand, and storytelling skills for documenting local public-goods work.",
            sourceLink: "https://x.com/techandsunhubs/status/2065360898831548810?s=20",
            sourceLabel: "View post on X"
        }
    },
    {
        id: 5,
        title: "Product Design Bootcamp",
        date: "July 01 - Ongoing",
        location: "Virtual workspace",
        type: "Bootcamp",
        status: "present",
        description: "Active high-fidelity training cohort focusing on user experience layout design for regenerative tech applications, local telemetry dashboards, and the Greenpayer app ecosystem.",
        details: {
            host: "TAS Lead Creative Technologists",
            attendance: "Attendance not published",
            duration: "6 Weeks (Ongoing)",
            outcome: "The active cohort is building practical product-design skills for accessible, low-bandwidth digital experiences.",
            sourceLink: "https://x.com/techandsunhubs/status/2068702968854044702?s=20",
            sourceLabel: "View post on X"
        }
    }
];

    const filteredEvents = events.filter(
        (event) => activeTab === "all" || event.status === activeTab
    );

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
        }
    }, [activeTab]);

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
                <div className="mb-12">
                    <div>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-4 drop-shadow-sm">
                            Hub Activities & Education
                        </h2>
                        <p className="font-body text-lg text-dark/70 max-w-xl">
                            Explore our educational bootcamps, workshops, and event history tracking the growth of off-grid solar-and-builder communities.
                        </p>
                    </div>
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

                <div className="min-h-96 pb-8" aria-live="polite">
                    {filteredEvents.length > 0 ? (
                        <ul
                            ref={scrollContainerRef}
                            aria-label="Hub activity cards"
                            className="hub-activities-carousel pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                            role="list"
                            tabIndex={0}
                        >
                            {filteredEvents.map((activity, idx) => {
                                const bgIcons = ["/Solar Panel.png", "/Battery.png", "/Node.png", "/Internet (Starlink).png"];
                                const bgIcon = bgIcons[idx % bgIcons.length];

                                return (
                                    <li
                                        key={activity.id}
                                        className="flex"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => openDialog(activity)}
                                            className="relative flex min-h-96 w-full flex-col overflow-hidden rounded-3xl border border-primary/20 bg-vibrant p-6 text-left shadow-sm transition-shadow hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:p-8"
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
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="flex min-h-96 w-full items-center justify-center rounded-3xl border border-dark/10 bg-vibrant/30 px-6 text-center text-dark/50 font-body">
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
                className="m-auto rounded-3xl border border-dark/15 bg-white p-0 shadow-2xl overflow-hidden max-w-2xl w-11/12 outline-none"
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
                                {selectedEvent.details.sourceLink && (
                                    <a
                                        href={selectedEvent.details.sourceLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto bg-primary hover:bg-light-green text-white font-heading text-sm font-bold px-6 py-2.5 rounded-full inline-flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                    >
                                        {selectedEvent.details.sourceLabel ?? "View source"}
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
                /* Dialog overlay / backdrop styling */
                dialog {
                    margin: auto;
                }

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
