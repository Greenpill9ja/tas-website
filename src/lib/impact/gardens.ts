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
// Staging-only illustrations requested by Afo. Replace with consented member quotes.
export const testimonials: Testimonial[] = [
    { kind: "sample", gardenId: "awka", quote: "Reliable power and internet give me space to focus on learning and building.", attribution: "Sample member testimonial", },
    { kind: "sample", gardenId: "awka", quote: "Having a place to meet other builders makes it easier to share ideas and work together.", attribution: "Sample member testimonial", },
    { kind: "sample", gardenId: "awka", quote: "Learning alongside others helps me turn a new skill into something I can use.", attribution: "Sample member testimonial", },
];
