"use client";

import { DownloadIcon } from "@radix-ui/react-icons";

import { CopyButton } from "@/components/copy-button";

/**
 * A requirement-template block: shows the `.md` content with a Copy button and
 * a Download button (the raw file, from /public/templates). Content is passed
 * in (read from the file at build) so the file stays the single source.
 */
export function TemplateBlock({
  filename,
  content,
}: {
  filename: string;
  content: string;
}) {
  return (
    <div className="mb-5 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-1.5">
        <span className="truncate font-mono text-[12px] text-muted-foreground">
          {filename}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <CopyButton text={content} />
          <a
            href={`/templates/${filename}`}
            download
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <DownloadIcon className="size-3.5" />
            Download
          </a>
        </div>
      </div>
      <pre className="overflow-x-auto bg-card p-4 font-mono text-[13px] leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
}
