// Single source of truth for cn() is @viliha/vui-ui. Re-exported here so shadcn's
// "@/lib/utils" alias keeps resolving. Do not reintroduce a local clsx/tailwind-merge impl.
export { cn } from "@viliha/vui-ui/utils";
