import type { DevelopmentPlacement } from "./development";

/** Presentation annotations for exact public attestations. Reported event dates come from the work note. */
export const workEditorial: Record<string, {
    title: string;
    summary: string;
    development?: DevelopmentPlacement;
    measurements?: { label: string; value: string }[];
}> = {
    "42161:0xd7791655d95bf577312d5e492426501c9185b33c5fbec3f01eb638b6f12fa1f1": {
        title: "Designing the hub", summary: "Structural drawings set out the hub before construction begins.",
        development: { stage: "design" },
    },
    "42161:0x406f44485adb599ed1e319bb9fa4de5e0ffd67a8bdab21b90d2afea8f10412b6": {
        title: "Preparing the site", summary: "Land allocation, clearing, surveying and site marking established the location and layout.",
        development: { stage: "site-preparation" },
    },
    "42161:0xa0045eb20c35968a990e278be6bf00d09b2d1c740956c61635ec904740169e80": {
        title: "Laying the foundation", summary: "A reinforced concrete foundation was prepared to support the container structure.",
        development: { stage: "foundation" },
    },
    "42161:0x9221d139f5b6fa7f74f3c04d22aa1b02e813c43ce84d43f353d71b46a32c8c86": {
        title: "Building the shell", summary: "The container was adapted with openings, structural supports and mounting points for the hub’s systems.",
        development: { stage: "shell" },
    },
    "42161:0x65e5ae0cc71290ce2990713a8d2f4385497d4cd0c9c551c6e016d1993012007a": {
        title: "Fitting the interior", summary: "Wood cladding and insulation turned the shell into a space for focused work.",
        development: { stage: "interior" },
    },
    "42161:0xdac0cbd55c05a422c3c1b1c5914b6ab4023a126c2abaf7cf7b883dade2d1521c": {
        title: "Installing solar power", summary: "The installation record documents solar panels, an inverter, battery storage and a smart meter.",
        development: { stage: "solar" },
        measurements: [{ label: "Panels reported installed", value: "7 × 600 W" }],
    },
    "42161:0xf4ea28a773ee42688bb4de0a61e0257ee3410aa0b15ba8afd816f604599040d0": {
        title: "Making room to work", summary: "Desks, collaborative tables, seating, storage and whiteboards equipped the workspace.",
        development: { stage: "furnishing" },
    },
    "42161:0xc1b9ab56eff24e03d77805649a194de2c00113c3450e8a945ed13d3e2b95d7f3": {
        title: "Giving the hub its identity", summary: "Green finishes and partner branding completed the hub’s exterior and interior identity.",
        development: { stage: "finishing" },
    },
    "42161:0x18f7e5efa10565eb9d6e545a9da6b58ce13cc234b03687ca878406db49517ec8": {
        title: "Opening the hub", summary: "The activation record documents the opening of TAS Hub at UNIZIK.",
        development: { stage: "opening", occurredOn: "2026-03-14" },
    },
};
