"use client";

import {
  CalendarIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@viliha/vui-ui/command";

import { H2, P, CodeBlock, Note } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
} from "@viliha/vui-ui/command";

export function Example() {
  return (
    <Command className="rounded-lg border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="command" />

      <ComponentPreview code={usage}>
        <Command className="w-full max-w-md rounded-lg border border-border shadow-sm">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <CalendarIcon />
                Calendar
              </CommandItem>
              <CommandItem>
                <FaceIcon />
                Search Emoji
              </CommandItem>
              <CommandItem>
                <RocketIcon />
                Launch
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <PersonIcon />
                Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <GearIcon />
                Settings
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="command" />

      <H2>Usage</H2>
      <P>Built on `cmdk`. Type to filter items across groups.</P>
      <CodeBlock title="command-demo.tsx">{usage}</CodeBlock>
      <Note title="Command in a dialog">
        For a modal ⌘K command menu, use VUI&apos;s{" "}
        <code>command-palette</code> (it wraps this in an overlay). The{" "}
        <code>command</code> primitive here is the inline menu.
      </Note>

      <ComponentDocFooter slug="command" />
    </article>
  );
}
