import type { GardenDefinition, MonthlyReport, Testimonial } from "./types";

/** Explicit membership, never a name search across the Green Goods network. */
export const tasGardens: GardenDefinition[] = [
    {
        id: "awka",
        name: "TAS Awka",
        location: "Awka, Nigeria",
        status: "active",
        chainId: 42161,
        address: "0xA2DF8Eb73444A3f3cf9b8E3749313C7471d7D5E3",
        // Hub Service Session is a solar action, but describes use of the hub.
        actionTracks: { 0: "construction", 1: "construction", 2: "community", 4: "community", 12: "community" },
    },
];

// Publish only reviewed reports. Earlier September fixtures lacked a confirmed source.
export const monthlyReports: MonthlyReport[] = [];
// Nansel confirmed website consent for these seven X posts on 2026-11-23 (GRTH-109).
export const testimonials: Testimonial[] = [
    {
        kind: "approved", gardenId: "awka", consentRecordedAt: "2026-11-23",
        portraitPath: "/images/testimonials/histoblogq.jpg",
        attribution: "@Histoblogq", quote: "There is no longer much distance between my ideas and real products",
        sourceUrl: "https://x.com/Histoblogq/status/2121953143747408176",
    },
    {
        kind: "approved", gardenId: "awka", consentRecordedAt: "2026-11-23",
        portraitPath: "/images/testimonials/emekadave01.jpg",
        attribution: "@Emekadave01", quote: "I don’t know what I would’ve done without the constant electricity and internet.",
        sourceUrl: "https://x.com/Emekadave01/status/2107538185941111119",
    },
    {
        kind: "approved", gardenId: "awka", consentRecordedAt: "2026-11-23",
        portraitPath: "/images/testimonials/iam_chuks_.jpg",
        attribution: "@Iam_Chuks_", quote: "Thank you for the free internet connection, electricity and space to learn & work.",
        sourceUrl: "https://x.com/Iam_Chuks_/status/2096899757935349880",
    },
    {
        kind: "approved", gardenId: "awka", consentRecordedAt: "2026-11-23",
        portraitPath: "/images/testimonials/solomon1249093.jpg",
        attribution: "@Solomon1249093", quote: "The free high-speed internet and solar power mean I can stay productive even during power outages.",
        sourceUrl: "https://x.com/Solomon1249093/status/2072807390706033133",
    },
    {
        kind: "approved", gardenId: "awka", consentRecordedAt: "2026-11-23",
        portraitPath: "/images/testimonials/francis44895568.jpg",
        attribution: "@Francis44895568", quote: "Free workspace. Free internet. Zero stress. Sometimes, all you need is the right environment to stay consistent and grow.",
        sourceUrl: "https://x.com/Francis44895568/status/2046157458377187551",
    },
    {
        kind: "approved", gardenId: "awka", consentRecordedAt: "2026-11-23",
        portraitPath: "/images/testimonials/emekadave01.jpg",
        attribution: "@Emekadave01", quote: "With poor electricity here, their free WiFi + power has helped me stay consistent and keep building.",
        sourceUrl: "https://x.com/Emekadave01/status/2041895413511331984",
    },
    {
        kind: "approved", gardenId: "awka", consentRecordedAt: "2026-11-23",
        portraitPath: "/images/testimonials/technovictorx.jpg",
        attribution: "@TechnoVictorX", quote: "My new creative space 😌 Founder and Builders will rise from this space.",
        sourceUrl: "https://x.com/TechnoVictorX/status/2034182844038128070",
    },
];
