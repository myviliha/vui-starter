"use client";

// The Sidebar / Layout / Direction picker.
//
// Each option is a small drawing of the thing it does, because "Inset" versus
// "Floating" means nothing as a word and everything as a picture. The drawings
// are divs with theme tokens, not images, so they follow dark mode and a
// tenant's brand like the rest of the app.

import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";

import {
  DENSITIES,
  DIRECTIONS,
  SIDEBAR_VARIANTS,
  useAppearance,
  type Appearance,
} from "@/app/_components/appearance";

function OptionCard({
  label,
  hint,
  selected,
  onSelect,
  children,
}: {
  label: string;
  hint: string;
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      title={hint}
      className="group flex cursor-pointer flex-col items-center gap-2 text-center"
    >
      <span
        className={cn(
          "relative block w-full overflow-hidden rounded-lg border-2 bg-muted/40 p-2 transition-colors",
          selected
            ? "border-[var(--button-primary)]"
            : "border-border group-hover:border-[var(--button-primary)]/40",
        )}
      >
        {selected && (
          <span className="absolute -top-1 -end-1 grid size-5 place-items-center rounded-full bg-foreground text-background">
            <CheckIcon className="vui-icon-plain size-3" />
          </span>
        )}
        {children}
      </span>
      <span className={cn("text-xs", selected ? "font-medium text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </button>
  );
}

/** The little wireframes. Same vocabulary throughout: bar = sidebar, blocks = content. */
const Bar = ({ className }: { className?: string }) => (
  <span className={cn("block rounded-[2px] bg-muted-foreground/30", className)} />
);

function SidebarPreview({ variant }: { variant: Appearance["sidebar"] }) {
  return (
    <span className="flex h-14 gap-1 rounded bg-background p-1">
      <span
        className={cn(
          "flex w-1/4 flex-col gap-1 bg-muted-foreground/20 p-1",
          variant === "floating" && "rounded-[3px] shadow-sm",
          variant === "inset" && "rounded-[3px]",
        )}
      >
        <Bar className="h-1 w-full" />
        <Bar className="h-1 w-3/4" />
        <Bar className="h-1 w-3/4" />
      </span>
      <span
        className={cn(
          "flex-1 bg-muted-foreground/10",
          variant !== "plain" && "rounded-[3px]",
          variant === "floating" && "ms-1",
        )}
      />
    </span>
  );
}

function DensityPreview({ density }: { density: Appearance["density"] }) {
  const gap = density === "compact" ? "gap-[2px]" : "gap-1";
  return (
    <span className="flex h-14 gap-1 rounded bg-background p-1">
      {density !== "full" && (
        <span className={cn("flex flex-col p-1", gap, density === "compact" ? "w-[12%]" : "w-1/4", "bg-muted-foreground/20 rounded-[3px]")}>
          <Bar className="h-1 w-full" />
          {density !== "compact" && <Bar className="h-1 w-3/4" />}
        </span>
      )}
      <span className={cn("flex flex-1 flex-col", gap, density === "full" ? "p-0" : "p-1")}>
        <Bar className="h-1.5 w-full" />
        <Bar className="h-1 w-2/3" />
        <span className="mt-auto block h-5 rounded-[3px] bg-muted-foreground/20" />
      </span>
    </span>
  );
}

function DirectionPreview({ direction }: { direction: Appearance["direction"] }) {
  return (
    <span
      className={cn("flex h-14 gap-1 rounded bg-background p-1", direction === "rtl" && "flex-row-reverse")}
    >
      <span className="flex w-1/4 flex-col gap-1 rounded-[3px] bg-muted-foreground/20 p-1">
        <Bar className="h-1 w-full" />
        <Bar className="h-1 w-3/4" />
      </span>
      <span className={cn("flex flex-1 flex-col gap-1", direction === "rtl" && "items-end")}>
        <Bar className="h-1 w-1/2" />
        <span className="block h-5 w-full rounded-[3px] bg-muted-foreground/20" />
        <Bar className="h-1 w-2/3" />
      </span>
    </span>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">{title}</p>
      <div className="grid grid-cols-3 gap-3">{children}</div>
    </div>
  );
}

export function AppearancePicker() {
  const appearance = useAppearance();

  return (
    <div className="space-y-6">
      <Group title="Sidebar">
        {SIDEBAR_VARIANTS.map((v) => (
          <OptionCard
            key={v.id}
            label={v.label}
            hint={v.hint}
            selected={appearance.sidebar === v.id}
            onSelect={() => appearance.set("sidebar", v.id)}
          >
            <SidebarPreview variant={v.id} />
          </OptionCard>
        ))}
      </Group>

      <Group title="Layout">
        {DENSITIES.map((d) => (
          <OptionCard
            key={d.id}
            label={d.label}
            hint={d.hint}
            selected={appearance.density === d.id}
            onSelect={() => appearance.set("density", d.id)}
          >
            <DensityPreview density={d.id} />
          </OptionCard>
        ))}
      </Group>

      <Group title="Direction">
        {DIRECTIONS.map((d) => (
          <OptionCard
            key={d.id}
            label={d.label}
            hint={d.hint}
            selected={appearance.direction === d.id}
            onSelect={() => appearance.set("direction", d.id)}
          >
            <DirectionPreview direction={d.id} />
          </OptionCard>
        ))}
      </Group>
    </div>
  );
}
