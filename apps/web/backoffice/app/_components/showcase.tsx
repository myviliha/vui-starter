import * as React from "react";

/** Live demo + code snippet, used by the shadcn/ui showcase pages. */
export function Demo({
  title,
  desc,
  code,
  children,
}: {
  title: string;
  desc?: string;
  code?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-muted/40 px-4 py-2.5">
        <h3 className="font-medium">{title}</h3>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </div>
      <div className="flex flex-wrap items-start gap-4 p-5">{children}</div>
      {code && (
        <pre className="overflow-x-auto border-t border-border bg-background p-4 font-mono text-[12.5px] leading-relaxed text-muted-foreground">
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}
