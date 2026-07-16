/**
 * Import/export helpers for RecordView datatables — no external dependencies.
 * CSV/JSON round-trip fully; "Excel" is an HTML table saved as .xls (Excel opens
 * it); PDF is browser print-to-PDF. True .xlsx read/write would need a library.
 */

export type IoColumn = { key: string; label: string };
type Row = Record<string, unknown>;

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function rowsToCSV(cols: IoColumn[], rows: Row[]): string {
  const head = cols.map((c) => csvEscape(c.label)).join(",");
  const body = rows
    .map((r) => cols.map((c) => csvEscape(String(r[c.key] ?? ""))).join(","))
    .join("\n");
  return `${head}\n${body}`;
}

export function rowsToTableHTML(cols: IoColumn[], rows: Row[]): string {
  const head = cols.map((c) => `<th>${htmlEscape(c.label)}</th>`).join("");
  const body = rows
    .map(
      (r) =>
        `<tr>${cols
          .map((c) => `<td>${htmlEscape(String(r[c.key] ?? ""))}</td>`)
          .join("")}</tr>`,
    )
    .join("");
  return `<table border="1" cellspacing="0" cellpadding="6"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

export function downloadFile(
  filename: string,
  content: string,
  mime: string,
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Open a print window with the table; the user saves as PDF from the dialog. */
export function printTable(title: string, tableHTML: string): void {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${htmlEscape(
      title,
    )}</title><style>body{font-family:Inter,system-ui,sans-serif;font-size:12px;padding:24px;color:#101112}h1{font-size:16px;margin:0 0 12px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #e2e0e8;padding:6px 8px;text-align:left}th{background:#f4f4f6}</style></head><body><h1>${htmlEscape(
      title,
    )}</h1>${tableHTML}</body></html>`,
  );
  w.document.close();
  w.focus();
  w.print();
}

/** Minimal CSV parser → objects keyed by header row. Handles quoted fields. */
export function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((c) => c !== "")) rows.push(row);
  }
  const header = rows[0];
  if (!header) return [];
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => {
      obj[h] = r[idx] ?? "";
    });
    return obj;
  });
}
