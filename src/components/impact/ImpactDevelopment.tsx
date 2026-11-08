import { useId } from "react";
import { developmentStages } from "@/lib/impact/development";
import type { GardenImpact, ImpactRecord } from "@/lib/impact/types";
import ImpactRecordCard from "./ImpactRecordCard";

export default function ImpactDevelopment({ impact, records, preview }: {
    impact: GardenImpact;
    records: ImpactRecord[];
    preview: boolean;
}) {
    const headingId = useId();
    const { garden, historyComplete } = impact;
    const milestones = developmentStages.map(stage => ({
        ...stage,
        evidence: records.filter(record => record.development?.stage === stage.id),
    })).filter(stage => stage.evidence.length > 0);
    const otherRecords = records.filter(record => !record.development);

    return <section aria-labelledby={headingId} className="border-t border-primary/15 pt-8"
        data-testid="impact-hub-timeline" data-hub={garden.id}>
        <h3 id={headingId} className="font-heading text-3xl font-bold">{garden.name}</h3>
        <p className="mt-2 font-body text-sm text-dark/70">{garden.location}</p>
        {records.length === 0 && <p className="mt-5 font-body text-dark/70">
            {historyComplete
                ? `No ${preview ? "example" : "approved"} development records for this hub yet.`
                : "Development records are temporarily unavailable."}
        </p>}
        {records.length > 0 && !historyComplete && <p className="mt-5 font-body text-sm text-dark/75">
            Some development records may be missing while the sources refresh.
        </p>}
        {milestones.length > 0 && <ol className="mt-8 grid gap-6 md:grid-cols-2">
            {milestones.map((stage, index) => <li key={stage.id} data-testid="impact-milestone" data-stage={stage.id} className="flex flex-col">
                <h4 className="font-heading text-xl font-bold text-primary">{stage.label}</h4>
                <ul className="mt-3 flex flex-1 flex-col gap-4">
                    {stage.evidence.map(record => <li key={record.id} className="flex-1">
                        <ImpactRecordCard record={record} gardenName={garden.name} step={index + 1}
                            inDevelopment preview={preview} />
                    </li>)}
                </ul>
            </li>)}
        </ol>}
        {otherRecords.length > 0 && <div className="mt-8">
            <h4 className="font-heading text-xl font-bold">Other development records</h4>
            <ul className="mt-3 grid gap-6 md:grid-cols-2">
                {otherRecords.map(record => <li key={record.id}>
                    <ImpactRecordCard record={record} gardenName={garden.name} inDevelopment preview={preview} />
                </li>)}
            </ul>
        </div>}
    </section>;
}
