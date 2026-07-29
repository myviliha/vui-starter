"use client";

import * as React from "react";

import { cn } from "./utils";
import { Combobox } from "./combobox";
import type { SelectOption } from "./select";

/**
 * A node in the cascade tree. Top-level nodes feed the first level; each node's
 * `children` feed the next level. Depth = however deep you nest (3, 4, N).
 */
export interface CascadeNode {
  value: string;
  label: string;
  children?: CascadeNode[];
}

/** One named level of the cascade (e.g. Region, Country, State, City). */
export interface CascadeLevel {
  /** Stable key for the level. */
  key: string;
  /** Label shown above the level's control. */
  label: string;
  placeholder?: string;
}

export interface CascadingComboboxProps {
  /** Ordered, named levels — one searchable Combobox is rendered per level. */
  levels: CascadeLevel[];
  /** Hierarchical data: root nodes = level 0; a node's `children` = the next level. */
  items: CascadeNode[];
  /** Selected path, one value per level (a shorter array = deeper levels unset). */
  value: string[];
  /** Fires with the new path and the resolved node at each step of it. */
  onValueChange: (value: string[], nodes: CascadeNode[]) => void;
  /** Stack the levels (default) or lay them out in a row. */
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/**
 * Cascading combobox for **fixed, named levels** (Region → Country → State →
 * City). Renders one searchable {@link Combobox} per level; picking a level
 * narrows the next from the selected node's `children` and **clears everything
 * downstream**. A level stays disabled until its parent is chosen.
 *
 * ```tsx
 * <CascadingCombobox
 *   levels={[
 *     { key: "region", label: "Region" },
 *     { key: "country", label: "Country" },
 *     { key: "state", label: "State" },
 *     { key: "city", label: "City" },
 *   ]}
 *   items={LOCATIONS}
 *   value={path}
 *   onValueChange={setPath}
 * />
 * ```
 */
export function CascadingCombobox({
  levels,
  items,
  value,
  onValueChange,
  orientation = "vertical",
  className,
}: CascadingComboboxProps) {
  // One row per level, walked down the currently-selected path: its options and
  // whether it's enabled (level 0 always; deeper levels need their parent set).
  const rows = React.useMemo(() => {
    const out: { level: CascadeLevel; options: SelectOption[]; enabled: boolean }[] =
      [];
    let nodes = items;
    levels.forEach((level, i) => {
      out.push({
        level,
        options: nodes.map((n) => ({ value: n.value, label: n.label })),
        enabled: i === 0 || Boolean(value[i - 1]),
      });
      const selected = nodes.find((n) => n.value === value[i]);
      nodes = selected?.children ?? [];
    });
    return out;
  }, [levels, items, value]);

  const handleSelect = (levelIndex: number, next: string) => {
    // Keep upstream, set this level, drop everything downstream.
    const path = value.slice(0, levelIndex);
    path[levelIndex] = next;

    // Resolve the node at each step of the new path.
    const nodes: CascadeNode[] = [];
    let pool = items;
    for (let i = 0; i < path.length; i++) {
      const node = pool.find((n) => n.value === path[i]);
      if (!node) break;
      nodes.push(node);
      pool = node.children ?? [];
    }

    onValueChange(path, nodes);
  };

  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "flex flex-wrap gap-3"
          : "flex flex-col gap-3",
        className,
      )}
    >
      {rows.map(({ level, options, enabled }, i) => {
        return (
          <div
            key={level.key}
            className={cn(
              "flex flex-col gap-1",
              orientation === "horizontal" && "min-w-40 flex-1",
            )}
          >
            <label
              htmlFor={level.key}
              className="text-xs font-medium text-muted-foreground"
            >
              {level.label}
            </label>
            <Combobox
              id={level.key}
              value={value[i] ?? ""}
              onValueChange={(next) => handleSelect(i, next)}
              options={options}
              ariaLabel={level.label}
              disabled={!enabled}
              placeholder={
                level.placeholder ?? `Select ${level.label.toLowerCase()}…`
              }
            />
          </div>
        );
      })}
    </div>
  );
}
