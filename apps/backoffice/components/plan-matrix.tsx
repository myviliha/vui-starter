import { Badge } from "@viliha/vui-ui/badge";

import { PLAN_AREAS, PLAN_MATRIX, PLAN_PLEDGE, type Plan } from "@/lib/plans";

/**
 * "Free" or "Pro", rendered the same everywhere it appears. Pro is styled as a
 * muted outline rather than something celebratory, because nothing in it ships
 * yet and a gold badge on vapour is a lie in CSS.
 */
export function PlanBadge({ plan }: { plan: Plan }) {
  return plan === "free" ? (
    <Badge variant="success">Free</Badge>
  ) : (
    <Badge variant="outline">Pro · planned</Badge>
  );
}

/** The full free-versus-Pro table, grouped by area. One source: lib/plans.ts. */
export function PlanMatrix() {
  return (
    <>
      <div className="mb-5 overflow-x-auto vui-scroll">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Area</th>
              <th className="py-2 pr-4 font-semibold">What</th>
              <th className="py-2 pr-4 font-semibold">Plan</th>
              <th className="py-2 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {PLAN_AREAS.map((area) =>
              PLAN_MATRIX.filter((e) => e.area === area).map((entry, i) => (
                <tr key={entry.item} className="border-b border-border align-top">
                  <td className="py-2 pr-4 font-medium whitespace-nowrap">
                    {i === 0 ? area : ""}
                  </td>
                  <td className="py-2 pr-4">{entry.item}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <PlanBadge plan={entry.plan} />
                  </td>
                  <td className="py-2 text-muted-foreground">{entry.note}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
      <p className="mb-5 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        {PLAN_PLEDGE}
      </p>
    </>
  );
}
