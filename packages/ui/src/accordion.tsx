"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import {
  ACCORDION_CHEVRON,
  ACCORDION_CONTENT,
  ACCORDION_CONTENT_INNER,
  ACCORDION_ITEM,
  ACCORDION_TRIGGER,
} from "./class-variants";
import { cn } from "./utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(ACCORDION_ITEM, className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(ACCORDION_TRIGGER, className)}
        {...props}
      >
        {children}
        <ChevronDownIcon className={ACCORDION_CHEVRON} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={ACCORDION_CONTENT}
      // theme.css animates --vui-accordion-height; Radix measures the content into
      // its own variable, so this is where the two meet. A caller's own style still
      // applies, it just can't drop the variable the animation needs.
      style={
        {
          "--vui-accordion-height": "var(--radix-accordion-content-height)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className={cn(ACCORDION_CONTENT_INNER, className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
