# TAS impact page

## Current scope

Implement Afo’s November 3 feedback on `nansel/grth-74-impact-page-staging`. The November 7 instruction replaces the earlier sample-work preview with live Green Goods data and the complete approved construction record. Stay on staging; do not promote to main.

## Behavior

- Preserve the original staging visual direction: square hero photograph with its caption overlay, spacious sections, large headings, illustrated count cards and the blue Locally rooted section. Keep the live impact module and three smaller sample testimonials.
- Frame the page around TAS, with network/garden counts, hub development, learning/community work, the Awka community story, testimonials, methodology and contact.
- Provide `/impact/preview` as a clearly labelled, noindex three-hub design variation. Example identities and records stay outside the live registry and loader. Do not attach real evidence or approval claims to examples.
- Use one hub selection across counts, work and testimonials, defaulting to all hubs. Preserve the selection in `?hub=` links; invalid selections fall back to all hubs. Show per-hub summaries when multiple hubs exist, and exclude building hubs from the active count.
- Use the public garden-impact v1 API for identity, visibility and summary counts. Read garden-scoped Work attestations and join chain-scoped Work Approval attestations by decoded workUID for history beyond the API’s twelve-record limit; historical approval recipients vary.
- Keep the union of approved records from the accepted API snapshot and EAS, keyed by chain and attestation identity. Prefer EAS data for shared records. Judge history completeness from EAS coverage before adding API records, even if the combined list matches the approved count.
- Render only work with a positive, unrevoked steward approval, matching Green Goods v1. Recorded and approved dates are not completion dates. Counts of records are not attendance, energy or learning-hour measurements.
- Keep garden membership, operating status and action-to-track mappings in a small explicit registry. A new garden must not require a new component or transport.
- Keep unknown actions visible as other recorded activity, unavailable values distinct from zero, and partial histories labelled through the page’s data state.
- Browse each record’s images on its card. Open the record in a centered desktop dialog or a bottom sheet on mobile, with the current image, the work note and links to the original evidence. Preserve image selection when closing the detail view.
- Show a separate development timeline for each hub. Assign approved records to ordered milestones by exact attestation identity, from design through opening, with solar installation as its own stage. Show records without a stage under the same hub. Display a reported event date only when the work note supplies it, and keep attestation dates in the details. The opening record stays in the community count and is displayed once in the timeline.
- Honor Green Goods `provenance.stale` while preserving its original `fetchedAt`. A retained API snapshot is a labelled cold-cache fallback, never a fresh replacement for a fuller successful local history. Skip extra EAS reads while the API reports that provider-failure state.
- Monthly reports require reviewed sources. No September fixture is a published measurement. Show PDF links only when supplied; no duplicate report-navigation section.
- Keep testimonials present with clearly labelled illustrative quotes, as Afo requested on November 7. Replace each with consented attribution before production publication.
- Remove work-preview toggles, implementation notes, the back-to-top link and the memorial on this page. Preserve the memorial elsewhere.

## Validation

Run `bun run agentic:check`, `bun test tests/impact-module.test.mjs tests/impact-data.test.mjs tests/impact-review.test.mjs tests/impact-preview.test.mjs`, and `bun run build`. Verify live summary/history counts through the new loader. Authenticated Brave desktop/mobile QA is required for rendered proof; CI Playwright is not a substitute. No dependency install is needed.

## Release boundary

Keep noindex while the branch contains illustrative testimonials. Staging implementation does not authorize production promotion. The original staging branch’s later navigation fix is already on develop and should be retained when this work is integrated.
