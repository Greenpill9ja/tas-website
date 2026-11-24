import type { DevelopmentStage } from "./development";
import type { GardenImpact, ImpactRecord, Testimonial } from "./types";

// Imported only by the explicit design-preview route, never by the live loader.
// Example identities have no chain address and cannot enter the public registry.
const examples: {
    id: string;
    name: string;
    status: "active" | "building";
    work: [title: string, stage: DevelopmentStage | "community", date: string, ...photos: string[]][];
}[] = [
    {
        id: "example-a", name: "Example hub A", status: "active",
        work: [
            ["A place to start", "site-preparation", "2026-01-10", "02-ground-foundation.jpeg", "01-container-ground.jpeg"],
            ["Solar power comes online", "solar", "2026-02-10", "05-rooftop-solar.jpeg"],
            ["A first community gathering", "opening", "2026-03-10", "16-community-launch.jpeg"],
            ["Learning with other builders", "community", "2026-04-10", "15-active-workspace.jpeg"],
            ["A shared space for everyday work", "community", "2026-05-10", "10-interior-desks.jpeg"],
        ],
    },
    {
        id: "example-b", name: "Example hub B", status: "active",
        work: [
            ["Making room for a new community", "interior", "2026-02-20", "06-interior-setup.jpeg"],
            ["Opening the doors", "opening", "2026-04-20", "08-hub-entrance.jpeg"],
            ["A peer learning session", "community", "2026-06-20", "09-active-workspace.jpeg"],
        ],
    },
    {
        id: "example-c", name: "Example hub C", status: "building",
        work: [
            ["Preparing the next site", "site-preparation", "2026-05-15", "01-container-ground.jpeg"],
            ["The space takes shape", "shell", "2026-06-15", "02-window-framing.jpeg"],
        ],
    },
];

export const previewGardens: GardenImpact[] = examples.map((example): GardenImpact => {
    const records: ImpactRecord[] = example.work.map(([title, stage, date, ...photos], index) => {
        const track = stage === "community" || stage === "opening" ? "community" : "construction";
        return {
            id: `${example.id}:${index}`, gardenId: example.id, title,
            summary: "An example of the work a hub could share as its community grows.",
            development: stage === "community" ? undefined : { stage },
            track, actionUid: track === "construction" ? 0 : 2,
            recordedAt: `${date}T00:00:00.000Z`, approvedAt: `${date}T00:00:00.000Z`,
            media: photos.map(photo => `/album/${photo}`), sourceUrl: "", attestationUrl: "", measurements: [],
        };
    });
    return {
        garden: { id: example.id, name: example.name, location: "Illustrative location · not an announced hub", status: example.status, chainId: 0, address: "", actionTracks: {} },
        records, submittedWorkCount: records.length, approvedWorkCount: records.length,
        approvedCountSource: null, historyComplete: true, status: "ready", fetchedAt: null,
    };
});

export const previewTestimonials: Testimonial[] = [
    { kind: "sample", gardenId: "example-a", quote: "Reliable power and internet give me space to focus on learning and building.", attribution: "Sample member testimonial" },
    { kind: "sample", gardenId: "example-b", quote: "Having a place to meet other builders makes it easier to share ideas and work together.", attribution: "Sample member testimonial" },
    { kind: "sample", gardenId: "example-c", quote: "I look forward to having a local space where we can learn and build together.", attribution: "Sample future member testimonial" },
];
