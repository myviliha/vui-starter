"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/**
 * Code, presented the way a developer product has to present it: a title bar
 * that names the file, one tab per file when there is more than one, and a copy
 * button that confirms it worked.
 *
 * There is no syntax highlighter here on purpose. Highlighting means shipping a
 * grammar bundle for every language you might show, and a marketing page rarely
 * shows more than twenty lines. Pass pre-highlighted HTML as `html` if you want
 * colour: run Shiki at build time, where the cost is paid once.
 */

export interface CodeFile {
  /** Shown on the tab and in the title bar. */
  name: string;
  /** Plain source. Ignored when `html` is set. */
  code: string;
  /** Pre-highlighted markup, from Shiki or similar. Trusted, so build it yourself. */
  html?: string;
  language?: string;
}

export interface CodeBlockProps {
  files: CodeFile[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  /** Line numbers down the gutter. Off by default; they get copied by mistake. */
  showLineNumbers?: boolean;
  tone?: SectionTone;
  /** Renders bare, with no surrounding section. For use inside another block. */
  bare?: boolean;
  className?: string;
}

export function CodeBlock({
  files,
  title,
  eyebrow,
  lead,
  showLineNumbers,
  tone,
  bare,
  className,
}: CodeBlockProps) {
  const [active, setActive] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  // An empty `files` is a caller bug, not a runtime state to design for.
  const file = files[Math.min(active, files.length - 1)]!;

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(file.code);
      setCopied(true);
    } catch {
      // Clipboard access can be refused, and there is nothing useful to say
      // about it: the code is on screen and can still be selected by hand.
    }
  }

  const lines = file.code.split("\n");

  const frame = (
    <div
      className={cn(
        "vui-ring-gradient overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-3)]",
        bare && className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 ps-3 pe-2">
        <span aria-hidden className="flex gap-1.5 py-3 pe-2">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        {files.length > 1 ? (
          <div role="tablist" aria-label="Files" className="vui-scroll flex min-w-0 flex-1 overflow-x-auto">
            {files.map((f, i) => (
              <button
                key={f.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-2.5 text-caption font-medium transition-colors",
                  i === active
                    ? "border-[var(--button-primary)] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
        ) : (
          <span className="min-w-0 flex-1 truncate py-2.5 text-caption text-muted-foreground">
            {file.name}
          </span>
        )}
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md border border-border px-2.5 py-1 text-caption font-medium transition-colors hover:bg-accent"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="vui-scroll overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          {file.html ? (
            // Built at build time by the host, never from user input.
            <code dangerouslySetInnerHTML={{ __html: file.html }} />
          ) : showLineNumbers ? (
            <code className="grid">
              {lines.map((line, i) => (
                <span key={i} className="grid grid-cols-[2.5ch_1fr] gap-4">
                  <span aria-hidden className="text-end text-muted-foreground/60 select-none">
                    {i + 1}
                  </span>
                  <span>{line || " "}</span>
                </span>
              ))}
            </code>
          ) : (
            <code>{file.code}</code>
          )}
        </pre>
      </div>
    </div>
  );

  if (bare) return frame;

  return (
    <Section tone={tone} width="lg" className={className}>
      {title && (
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />
      )}
      {frame}
    </Section>
  );
}
