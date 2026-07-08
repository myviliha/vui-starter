// Single source of truth for cn() is @repo/ui. Re-exported here so shadcn's
// "@/lib/utils" alias keeps resolving. Do not reintroduce a local clsx/tailwind-merge impl.
export { cn } from "@repo/ui/utils";
