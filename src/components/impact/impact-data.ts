/** View model only. Adapt the confirmed GRTH-97 response here, not in the UI. */
export type WorkRecord = {
    id: string;
    title: string;
    category: "Learning" | "Community" | "Infrastructure";
    summary: string;
    image: string;
    completedAt: string | null;
    contributor: string | null;
    hub: string;
    verification: "sample" | "pending" | "verified";
    publicRecordUrl: string | null;
    sourceNote: string;
};

export const sampleRecords: WorkRecord[] = [
    { id: "sample-learning", title: "Learning, together", category: "Learning", summary: "A preview of how a learning session will appear: what participants worked on, what they contributed and the evidence they chose to share.", image: "/album/15-active-workspace.jpeg", completedAt: null, contributor: null, hub: "Awka", verification: "sample", publicRecordUrl: null, sourceNote: "Layout example only. Existing TAS gallery photograph; not evidence for this sample record." },
    { id: "sample-community", title: "A community making space", category: "Community", summary: "A place for community-led activities, shared experiences and the people who help keep the hub useful.", image: "/album/16-community-launch.jpeg", completedAt: null, contributor: null, hub: "Awka", verification: "sample", publicRecordUrl: null, sourceNote: "Layout example only. Date, contributor consent and public record will come from the reviewed data source." },
    { id: "sample-infrastructure", title: "The infrastructure behind it", category: "Infrastructure", summary: "Documenting the practical work behind dependable power and connectivity, with a dated record and a clear source.", image: "/album/05-rooftop-solar.jpeg", completedAt: null, contributor: null, hub: "Awka", verification: "sample", publicRecordUrl: null, sourceNote: "Layout example only. No energy generation, uptime or avoided-emissions result is claimed." },
];

export const monthlyReports = {
    "2026-09": { label: "September 2026", status: "Review figures · source report not confirmed", source: "https://x.com/techandsunhubs/status/2106827158391808275", sourceReviewed: false, note: "327 visits previously reported. Source and counting definitions still require confirmation; repeat visits are not unique participants.", visits: "327", values: ["177", "280", "3.93", "72"] },
    "2026-10": { label: "October 2026", status: "Report not supplied", source: null, sourceReviewed: false, note: "No October report has been supplied for this preview. Unavailable readings are not zero.", visits: null, values: [null, null, null, null] },
} as const;

/** Populate only from the reviewed GRTH-97 mapping; samples are never promoted here. */
export const publishedRecords: WorkRecord[] = [];

function publicHttpsUrl(value: string | null): URL | null {
    if (!value) return null;
    try {
        const url = new URL(value);
        return url.protocol === "https:" && !url.username && !url.password ? url : null;
    } catch { return null; }
}

export function getReportSource(report: { source: string | null; sourceReviewed: boolean }): string | null {
    return report.sourceReviewed ? publicHttpsUrl(report.source)?.href ?? null : null;
}

export function getWorkRecordUrl(record: WorkRecord): string | null {
    if (record.verification === "sample") return null;
    const url = publicHttpsUrl(record.publicRecordUrl);
    if (!url || !(url.hostname === "greengoods.app" || url.hostname.endsWith(".greengoods.app"))) return null;
    return url.href;
}

export const metricDefinitions = [
    { label: "Unique participants", unit: "people", description: "People counted once within the selected month. Not a lifetime total." },
    { label: "Energy consumed", unit: "kWh", description: "Electricity used at the hub. Consumption is not solar generation." },
    { label: "Internet provided", unit: "TB", description: "Reported data usage during the selected period." },
    { label: "Learning activity", unit: "hours", description: "Reported learning hours. Counting method requires confirmation." },
];
