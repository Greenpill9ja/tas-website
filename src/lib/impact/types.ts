import type { DevelopmentPlacement } from "./development";

export type ImpactTrack = "construction" | "community";

export type GardenDefinition = {
    id: string;
    name: string;
    location: string;
    status: "active" | "building" | "archived";
    chainId: number;
    address: string;
    actionTracks: Record<number, ImpactTrack>;
};

export type ImpactRecord = {
    id: string;
    gardenId: string;
    title: string;
    summary: string;
    sourceDescription?: string;
    development?: DevelopmentPlacement;
    media: string[];
    actionUid: number;
    track: ImpactTrack | null;
    recordedAt: string;
    approvedAt: string;
    sourceUrl: string;
    attestationUrl: string;
    measurements: { label: string; value: string }[];
};

export type GardenImpact = {
    garden: GardenDefinition;
    submittedWorkCount: number | null;
    approvedWorkCount: number | null;
    approvedCountSource: "api" | "attestations" | null;
    records: ImpactRecord[];
    historyComplete: boolean;
    status: "ready" | "partial" | "unavailable" | "stale";
    fetchedAt: string | null;
};

export type MonthlyReport = {
    gardenId: string;
    month: string;
    sourceUrl: string;
    pdfUrl?: string;
    reviewedAt: string;
    metrics: { label: string; value: number; unit: string; definition: string }[];
};

export type Testimonial = {
    gardenId: string;
    quote: string;
    attribution: string;
} & ({ kind: "approved"; sourceUrl: string; consentRecordedAt: string } | { kind: "sample" });
