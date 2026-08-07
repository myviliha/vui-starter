"use client";

import {
  CodeIcon as Code,
  FileTextIcon as FileText,
  ReaderIcon as Reader,
  TableIcon as SheetIcon,
} from "@radix-ui/react-icons";

import {
  downloadFile,
  parseCSV,
  printTable,
  rowsToCSV,
  rowsToTableHTML,
  type IoColumn,
} from "./table-io";
import { type IoAction, type IoActionsConfig, type IoContext } from "./config";

/**
 * The Import and Export menus the theme ships, built from the same
 * {@link IoAction} type a host uses. That is the point: the defaults are not a
 * special case in the component, they are one particular list, so replacing
 * them or adding to them is the same API rather than a different one.
 *
 * They do the work in the browser: read the file the person picked, write the
 * file they asked for. That is right for a demo and for small lists, and wrong
 * as soon as the data outgrows the page someone is looking at, because the
 * browser only has that page. When that happens, point the actions at your API
 * and use `ctx.query` to ask for everything that matches.
 */
const fileBase = (title: string) =>
  title.toLowerCase().replace(/\s+/g, "-") || "export";

/** Export: CSV, Excel, JSON, and PDF via the print dialog. */
export function defaultExportActions<T>(): IoAction<T>[] {
  const rows = (ctx: IoContext<T>) => ctx.rows as Record<string, unknown>[];
  const cols = (ctx: IoContext<T>) => ctx.columns as IoColumn[];
  return [
    {
      id: "csv",
      label: "CSV",
      icon: FileText,
      onAct: (ctx) =>
        downloadFile(
          `${fileBase(ctx.title)}.csv`,
          rowsToCSV(cols(ctx), rows(ctx)),
          "text/csv;charset=utf-8",
        ),
    },
    {
      id: "excel",
      label: "Excel",
      icon: SheetIcon,
      onAct: (ctx) =>
        downloadFile(
          `${fileBase(ctx.title)}.xls`,
          rowsToTableHTML(cols(ctx), rows(ctx)),
          "application/vnd.ms-excel",
        ),
    },
    {
      id: "json",
      label: "JSON",
      icon: Code,
      onAct: (ctx) =>
        downloadFile(
          `${fileBase(ctx.title)}.json`,
          JSON.stringify(rows(ctx), null, 2),
          "application/json",
        ),
    },
    {
      id: "pdf",
      label: "PDF",
      icon: Reader,
      onAct: (ctx) => printTable(ctx.title, rowsToTableHTML(cols(ctx), rows(ctx))),
    },
  ];
}

/**
 * Import: read a CSV or JSON file in the browser and put the rows into the
 * table. Values are matched to fields by key first, then by label, so a
 * spreadsheet exported from this table imports back into it.
 */
export function defaultImportActions<T extends { id: string | number }>(
  makeEmptyRow: (() => T) | undefined,
  nextId: () => string | number,
): IoAction<T>[] {
  if (!makeEmptyRow) return []; // read-only list: nothing to import into
  const read = async (ctx: IoContext<T>) => {
    const file = ctx.file;
    if (!file) return;
    const text = await file.text();
    let records: Record<string, unknown>[] = [];
    try {
      if (file.name.toLowerCase().endsWith(".json")) {
        const parsed: unknown = JSON.parse(text);
        records = Array.isArray(parsed)
          ? (parsed as Record<string, unknown>[])
          : [];
      } else {
        records = parseCSV(text);
      }
    } catch {
      return; // malformed file: nothing imported, table untouched
    }
    const byKey = new Map(ctx.columns.map((c) => [c.key.toLowerCase(), c.key]));
    const byLabel = new Map(
      ctx.columns.map((c) => [c.label.toLowerCase(), c.key]),
    );
    const rows = records.map((record) => {
      const row = { ...makeEmptyRow(), id: nextId() } as Record<
        string,
        unknown
      >;
      for (const [name, value] of Object.entries(record)) {
        const key =
          byKey.get(name.toLowerCase()) ?? byLabel.get(name.toLowerCase());
        if (key) row[key] = value;
      }
      return row as T;
    });
    if (rows.length) ctx.applyRows(rows);
  };
  return [
    { id: "csv", label: "CSV", icon: FileText, pickFile: true, accept: ".csv", onAct: read },
    { id: "json", label: "JSON", icon: Code, pickFile: true, accept: ".json", onAct: read },
    {
      id: "excel",
      label: "Excel",
      icon: SheetIcon,
      pickFile: true,
      // Excel exports as CSV; a real .xls is a binary format the browser can't
      // read without a parser, and this package doesn't ship one.
      accept: ".csv",
      onAct: read,
    },
  ];
}

/** Apply a host's config to a shipped list: an array replaces, a function edits. */
export function resolveIoActions<T>(
  defaults: IoAction<T>[],
  config: IoActionsConfig<T> | undefined,
): IoAction<T>[] {
  if (!config) return defaults;
  return typeof config === "function" ? config(defaults) : config;
}
