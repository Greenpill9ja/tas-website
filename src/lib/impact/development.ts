import type { ImpactRecord } from "./types";

/** Story order describes the work. Attestation timestamps describe the evidence. */
export const developmentStages = [
    { id: "design", label: "Design" },
    { id: "site-preparation", label: "Site preparation" },
    { id: "foundation", label: "Foundation" },
    { id: "shell", label: "Shell fabrication" },
    { id: "interior", label: "Interior fit-out" },
    { id: "solar", label: "Solar installation" },
    { id: "furnishing", label: "Furnishing" },
    { id: "finishing", label: "Finishing and branding" },
    { id: "opening", label: "Opening" },
] as const;

export type DevelopmentStage = (typeof developmentStages)[number]["id"];

export type DevelopmentPlacement = {
    stage: DevelopmentStage;
    /** Date of the work reported by its source, when documented. */
    occurredOn?: string;
};

export function belongsInDevelopment(record: ImpactRecord): boolean {
    return record.track === "construction" ||
        (record.track === "community" && record.development?.stage === "opening");
}
