"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  PlusIcon,
} from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@viliha/vui-ui/dialog";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

type Ev = { id: number; date: string; time: string; title: string };

const keyOf = (d: Date) => format(d, "yyyy-MM-dd");
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const today = new Date();
const rel = (days: number) => keyOf(addDays(today, days));
const SEED: Ev[] = [
  { id: 1, date: rel(0), time: "09:30", title: "Standup" },
  { id: 2, date: rel(0), time: "14:00", title: "Design review" },
  { id: 3, date: rel(2), time: "11:00", title: "Onboarding call" },
  { id: 4, date: rel(5), time: "16:30", title: "1:1 with Ava" },
  { id: 5, date: rel(-3), time: "10:00", title: "Sprint planning" },
];

export default function CalendarPage() {
  const [view, setView] = React.useState(() => startOfMonth(today));
  const [events, setEvents] = React.useState<Ev[]>(SEED);
  const [dialogDate, setDialogDate] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [time, setTime] = React.useState("09:00");

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(view), { weekStartsOn: 0 });
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [view]);

  const byDate = React.useMemo(() => {
    const map = new Map<string, Ev[]>();
    for (const e of events) {
      const list = map.get(e.date);
      if (list) list.push(e);
      else map.set(e.date, [e]);
    }
    for (const list of map.values())
      list.sort((a, b) => a.time.localeCompare(b.time));
    return map;
  }, [events]);

  const openAdd = (dateKey: string) => {
    setDialogDate(dateKey);
    setTitle("");
    setTime("09:00");
  };
  const save = () => {
    if (!dialogDate || !title.trim()) return;
    setEvents((prev) => [
      ...prev,
      { id: Date.now(), date: dialogDate, time, title: title.trim() },
    ]);
    setDialogDate(null);
  };
  const remove = (id: number) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Calendar" icon={CalendarIcon} />
      <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
        <Breadcrumbs />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        {/* Toolbar */}
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button onClick={() => setView(startOfMonth(today))}>Today</Button>
            <div className="flex items-center">
              <Button
                size="icon"
                aria-label="Previous month"
                onClick={() => setView((v) => subMonths(v, 1))}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                aria-label="Next month"
                onClick={() => setView((v) => addMonths(v, 1))}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
            <h2 className="text-lg font-semibold tracking-tight">
              {format(view, "MMMM yyyy")}
            </h2>
          </div>
          <Button variant="primary" onClick={() => openAdd(keyOf(today))}>
            <PlusIcon className="size-4" />
            Add appointment
          </Button>
        </div>

        {/* Calendar grid */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
          {/* Weekday header */}
          <div className="grid shrink-0 grid-cols-7 border-b border-border bg-muted/40">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>
          {/* 6-week grid */}
          <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
            {days.map((day) => {
              const dk = keyOf(day);
              const list = byDate.get(dk) ?? [];
              const inMonth = isSameMonth(day, view);
              const shown = list.slice(0, 3);
              const extra = list.length - shown.length;
              return (
                <div key={dk} className={cnCell(inMonth)}>
                  <div className="flex items-center justify-between">
                    <span
                      className={cnDate(inMonth, isToday(day))}
                      aria-current={isToday(day) ? "date" : undefined}
                    >
                      {format(day, "d")}
                    </span>
                    <button
                      type="button"
                      onClick={() => openAdd(dk)}
                      aria-label={`Add appointment on ${format(day, "d MMM")}`}
                      className="grid size-5 shrink-0 place-items-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <PlusIcon className="size-3.5" />
                    </button>
                  </div>
                  <div className="mt-0.5 flex flex-col gap-0.5 overflow-hidden">
                    {shown.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => remove(e.id)}
                        title={`${e.time} ${e.title} — click to remove`}
                        className="flex items-center gap-1 truncate rounded bg-[var(--button-primary)] px-1 py-0.5 text-left text-[11px] text-[var(--button-primary-foreground)] transition-opacity hover:opacity-90"
                      >
                        <span className="tabular-nums opacity-80">{e.time}</span>
                        <span className="truncate">{e.title}</span>
                      </button>
                    ))}
                    {extra > 0 && (
                      <span className="px-1 text-[11px] text-muted-foreground">
                        +{extra} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add appointment dialog */}
      <Dialog
        open={dialogDate !== null}
        onClose={() => setDialogDate(null)}
        label="Add appointment"
      >
        <DialogHeader>
          <DialogTitle>
            Add appointment
            {dialogDate && (
              <span className="ml-2 font-normal text-muted-foreground">
                {format(new Date(`${dialogDate}T00:00:00`), "EEE, d MMM yyyy")}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center gap-2">
            <Input
              type="time"
              aria-label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-28 shrink-0"
            />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              placeholder="Appointment title…"
              aria-label="Appointment title"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setDialogDate(null)}>
            <Cross2Icon className="size-4" />
            Cancel
          </Button>
          <Button variant="primary" onClick={save} disabled={!title.trim()}>
            <PlusIcon className="size-4" />
            Add
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function cnCell(inMonth: boolean): string {
  return [
    "group flex min-h-0 flex-col items-stretch overflow-hidden border-b border-r border-border p-1 transition-colors hover:bg-accent/30",
    inMonth ? "bg-card" : "bg-muted/30",
  ].join(" ");
}

function cnDate(inMonth: boolean, today_: boolean): string {
  return [
    "inline-flex size-6 items-center justify-center self-start rounded-full text-xs",
    today_
      ? "bg-[var(--button-primary)] font-semibold text-[var(--button-primary-foreground)]"
      : inMonth
        ? "text-foreground"
        : "text-muted-foreground",
  ].join(" ");
}
