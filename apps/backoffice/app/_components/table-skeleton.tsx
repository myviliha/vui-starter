// Lightweight datatable placeholder — matches the RecordView frame (header bar
// + rows) so the swap from skeleton to table is seamless. Used as the
// next/dynamic `loading` fallback so the shell paints before the datatable
// chunk parses. See AGENTS.md → "Architecture: three layers".
export function TableSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="vui-shimmer h-6 w-48 rounded-md" />
        <div className="vui-shimmer h-8 w-28 rounded-md" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="vui-shimmer h-11 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
