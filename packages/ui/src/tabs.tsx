"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import {
  TABS_CONTENT,
  TABS_LIST_BASE,
  TABS_LIST_VARIANTS,
  TABS_ROOT,
  TABS_TRIGGER,
  type TabsListVariant,
} from "./class-variants";
import { cn } from "./utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(TABS_ROOT, className)}
      {...props}
    />
  );
}

/** Kept for callers that composed with it; the strings live in class-variants. */
export function tabsListVariants({
  variant = "default",
}: { variant?: TabsListVariant | null } = {}): string {
  return cn(TABS_LIST_BASE, TABS_LIST_VARIANTS[variant ?? "default"]);
}

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: TabsListVariant;
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(TABS_TRIGGER, className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(TABS_CONTENT, className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
