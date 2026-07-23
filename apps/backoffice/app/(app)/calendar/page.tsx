"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  setHours,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  Cross2Icon,
  HomeIcon,
  PersonIcon,
  PlusIcon,
  TextAlignLeftIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";
import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { Checkbox } from "@viliha/vui-ui/checkbox";
import { Select } from "@viliha/vui-ui/select";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@viliha/vui-ui/dialog";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

type EvType = "event" | "task" | "appointment";
type Ev = {
  id: number;
  date: string; // yyyy-MM-dd
  start: string; // HH:mm
  end: string; // HH:mm
  title: string;
  color: string; // EVENT_COLORS key
  type: EvType;
  guests?: string;
  meet?: boolean;
  location?: string;
  description?: string;
  notify: string; // minutes before, as string
};
type Draft = Omit<Ev, "id">;
type Mode = "month" | "week" | "day";

const keyOf = (d: Date) => format(d, "yyyy-MM-dd");
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, h) => h);
const HOUR_REM = 3.5; // matches h-14 hour rows

// time helpers ("HH:mm")
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const minToTime = (m: number) => {
  const c = Math.max(0, Math.min(24 * 60 - 1, m));
  return `${String(Math.floor(c / 60)).padStart(2, "0")}:${String(c % 60).padStart(2, "0")}`;
};
const hourLabel = (h: number) => format(setHours(new Date(2000, 0, 1), h), "h a");
const timeLabel = (t: string) => format(new Date(`2000-01-01T${t}:00`), "h:mm a");

// Google-style color labels — static Tailwind classes (same convention as TAB_COLORS).
const EVENT_COLORS: { key: string; label: string; chip: string; dot: string }[] =
  [
    { key: "blueberry", label: "Blueberry", chip: "bg-blue-600 text-white", dot: "bg-blue-600" },
    { key: "tomato", label: "Tomato", chip: "bg-red-600 text-white", dot: "bg-red-600" },
    { key: "tangerine", label: "Tangerine", chip: "bg-orange-500 text-white", dot: "bg-orange-500" },
    { key: "banana", label: "Banana", chip: "bg-yellow-400 text-black", dot: "bg-yellow-400" },
    { key: "sage", label: "Sage", chip: "bg-green-500 text-white", dot: "bg-green-500" },
    { key: "peacock", label: "Peacock", chip: "bg-cyan-600 text-white", dot: "bg-cyan-600" },
    { key: "lavender", label: "Lavender", chip: "bg-violet-400 text-black", dot: "bg-violet-400" },
    { key: "grape", label: "Grape", chip: "bg-purple-600 text-white", dot: "bg-purple-600" },
    { key: "graphite", label: "Graphite", chip: "bg-gray-500 text-white", dot: "bg-gray-500" },
  ];
const DEFAULT_COLOR = "blueberry";
const CHIP_FOR = new Map(EVENT_COLORS.map((c) => [c.key, c.chip]));
const chipFor = (key: string) =>
  CHIP_FOR.get(key) ?? "bg-blue-600 text-white";

// 15-minute slots, labelled in AM/PM — replaces the native time picker.
const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const t = minToTime(i * 15);
  return { value: t, label: timeLabel(t) };
});

const NOTIFY_OPTIONS = [
  { value: "0", label: "At time of event" },
  { value: "5", label: "5 minutes before" },
  { value: "10", label: "10 minutes before" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "1440", label: "1 day before" },
];
const TYPE_TABS: { key: EvType; label: string }[] = [
  { key: "event", label: "Event" },
  { key: "task", label: "Task" },
  { key: "appointment", label: "Appointment schedule" },
];

const today = new Date();
const rel = (days: number) => keyOf(addDays(today, days));
const SEED: Ev[] = [
  { id: 1, date: rel(0), start: "09:30", end: "10:00", title: "Standup", color: "peacock", type: "event", notify: "10" },
  { id: 6, date: rel(0), start: "09:45", end: "10:30", title: "Client sync", color: "tangerine", type: "event", notify: "10" },
  { id: 2, date: rel(0), start: "14:00", end: "15:00", title: "Design review", color: "grape", type: "event", notify: "10", meet: true },
  { id: 3, date: rel(2), start: "11:00", end: "12:00", title: "Onboarding call", color: "tangerine", type: "event", notify: "15" },
  { id: 4, date: rel(5), start: "16:30", end: "17:00", title: "1:1 with Ava", color: "sage", type: "event", notify: "10" },
  { id: 5, date: rel(-3), start: "10:00", end: "11:30", title: "Sprint planning", color: "tomato", type: "event", notify: "30" },
];

export default function CalendarPage() {
  const [mode, setMode] = React.useState<Mode>("month");
  const [cursor, setCursor] = React.useState(today);
  const [events, setEvents] = React.useState<Ev[]>(SEED);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [more, setMore] = React.useState(false);

  const byDate = React.useMemo(() => {
    const map = new Map<string, Ev[]>();
    for (const e of events) {
      const list = map.get(e.date);
      if (list) list.push(e);
      else map.set(e.date, [e]);
    }
    for (const list of map.values())
      list.sort((a, b) => a.start.localeCompare(b.start));
    return map;
  }, [events]);

  const openAdd = (dateKey: string, hour?: number) => {
    const start = hour === undefined ? "09:00" : `${String(hour).padStart(2, "0")}:00`;
    setMore(false);
    setDraft({
      date: dateKey,
      start,
      end: minToTime(toMin(start) + 60),
      title: "",
      color: DEFAULT_COLOR,
      type: "event",
      guests: "",
      meet: false,
      location: "",
      description: "",
      notify: "10",
    });
  };
  const setD = (patch: Partial<Draft>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d));
  const save = () => {
    if (!draft || !draft.title.trim()) return;
    const end =
      toMin(draft.end) > toMin(draft.start)
        ? draft.end
        : minToTime(toMin(draft.start) + 60);
    setEvents((prev) => [
      ...prev,
      { ...draft, id: Date.now(), title: draft.title.trim(), end },
    ]);
    setDraft(null);
  };
  const remove = (id: number) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  const step = (dir: 1 | -1) =>
    setCursor((c) =>
      mode === "month"
        ? dir === 1
          ? addMonths(c, 1)
          : subMonths(c, 1)
        : mode === "week"
          ? addDays(c, dir * 7)
          : addDays(c, dir),
    );

  const heading =
    mode === "month"
      ? format(cursor, "MMMM yyyy")
      : mode === "week"
        ? `${format(startOfWeek(cursor), "MMM d")} – ${format(endOfWeek(cursor), "MMM d, yyyy")}`
        : format(cursor, "EEEE, MMM d, yyyy");

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
            <Button onClick={() => setCursor(today)}>Today</Button>
            <div className="flex items-center">
              <Button size="icon" aria-label="Previous" onClick={() => step(-1)}>
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button size="icon" aria-label="Next" onClick={() => step(1)}>
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
            <h2 className="text-lg font-semibold tracking-tight">{heading}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div
              role="tablist"
              aria-label="Calendar view"
              className="flex items-center rounded-md border border-border p-0.5"
            >
              {(["month", "week", "day"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={cnTab(mode === m)}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <Button variant="primary" onClick={() => openAdd(keyOf(today))}>
              <PlusIcon className="size-4" />
              Add appointment
            </Button>
          </div>
        </div>

        {mode === "month" ? (
          <MonthView cursor={cursor} byDate={byDate} openAdd={openAdd} remove={remove} />
        ) : (
          <TimeGridView
            days={
              mode === "day"
                ? [cursor]
                : Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i))
            }
            byDate={byDate}
            openAdd={openAdd}
            remove={remove}
          />
        )}
      </div>

      {/* Add appointment dialog — Google-style */}
      <Dialog
        open={draft !== null}
        onClose={() => setDraft(null)}
        label="Add appointment"
        className="max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>New appointment</DialogTitle>
        </DialogHeader>
        {draft && (
          <DialogBody>
            <div className="flex flex-col gap-4">
              {/* Title with live color accent */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "size-3 shrink-0 rounded-full",
                    EVENT_COLORS.find((c) => c.key === draft.color)?.dot,
                  )}
                />
                <input
                  value={draft.title}
                  onChange={(e) => setD({ title: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && save()}
                  placeholder="Add title"
                  aria-label="Title"
                  className="w-full border-0 border-b border-input bg-transparent pb-1 text-lg font-medium placeholder:font-normal placeholder:text-muted-foreground focus-visible:border-[var(--button-primary)] focus-visible:outline-none"
                />
              </div>

              {/* Type tabs */}
              <div
                role="tablist"
                aria-label="Entry type"
                className="flex items-center gap-1 rounded-md bg-muted/50 p-0.5"
              >
                {TYPE_TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={draft.type === t.key}
                    onClick={() => setD({ type: t.key })}
                    className={cnTab(draft.type === t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Date + start–end range */}
              <Row icon={<ClockIcon className="size-4" />}>
                <span className="text-sm font-medium">
                  {format(new Date(`${draft.date}T00:00:00`), "EEEE, MMM d")}
                </span>
                <Select
                  value={draft.start}
                  onValueChange={(v) =>
                    setD({
                      start: v,
                      end:
                        toMin(draft.end) <= toMin(v)
                          ? minToTime(toMin(v) + 60)
                          : draft.end,
                    })
                  }
                  options={TIME_OPTIONS}
                  ariaLabel="Start time"
                  className="w-28 shrink-0"
                />
                <span className="text-muted-foreground">–</span>
                <Select
                  value={draft.end}
                  onValueChange={(v) => setD({ end: v })}
                  options={TIME_OPTIONS}
                  ariaLabel="End time"
                  className="w-28 shrink-0"
                />
              </Row>

              {/* Color label — essential, always visible */}
              <Row icon={<CalendarIcon className="size-4" />}>
                <div className="flex flex-wrap items-center gap-1.5">
                  {EVENT_COLORS.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      aria-label={c.label}
                      aria-pressed={draft.color === c.key}
                      title={c.label}
                      onClick={() => setD({ color: c.key })}
                      className={cn(
                        "size-5 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110",
                        c.dot,
                        draft.color === c.key && "ring-2 ring-foreground",
                      )}
                    />
                  ))}
                </div>
              </Row>

              {/* Progressive disclosure — keep the default add simple */}
              {!more && (
                <button
                  type="button"
                  onClick={() => setMore(true)}
                  className="self-start text-sm font-medium text-[var(--button-primary)] hover:underline"
                >
                  More options
                </button>
              )}

              {more && (
                <div className="flex flex-col gap-4 border-t border-border pt-4">
                  {/* Guests */}
                  <Row icon={<PersonIcon className="size-4" />}>
                    <Input
                      value={draft.guests}
                      onChange={(e) => setD({ guests: e.target.value })}
                      placeholder="Add guests (comma-separated)"
                      aria-label="Guests"
                    />
                  </Row>

                  {/* Google Meet */}
                  <Row icon={<VideoIcon className="size-4" />}>
                    <label
                      htmlFor="cal-meet"
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        id="cal-meet"
                        checked={draft.meet}
                        onChange={(e) => setD({ meet: e.target.checked })}
                      />
                      Add Google Meet video conferencing
                    </label>
                  </Row>

                  {/* Location */}
                  <Row icon={<HomeIcon className="size-4" />}>
                    <Input
                      value={draft.location}
                      onChange={(e) => setD({ location: e.target.value })}
                      placeholder="Add location"
                      aria-label="Location"
                    />
                  </Row>

                  {/* Description */}
                  <Row icon={<TextAlignLeftIcon className="size-4" />}>
                    <textarea
                      value={draft.description}
                      onChange={(e) => setD({ description: e.target.value })}
                      placeholder="Add description"
                      aria-label="Description"
                      rows={2}
                      className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </Row>

                  {/* Notify */}
                  <Row icon={<PersonIcon className="size-4" />}>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Suman Bonakurthi · Busy ·</span>
                      <Select
                        value={draft.notify}
                        onValueChange={(v) => setD({ notify: v })}
                        options={NOTIFY_OPTIONS}
                        ariaLabel="Notification"
                        className="w-44"
                      />
                    </div>
                  </Row>
                </div>
              )}
            </div>
          </DialogBody>
        )}
        <DialogFooter>
          <Button onClick={() => setDraft(null)}>
            <Cross2Icon className="size-4" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={save}
            disabled={!draft?.title.trim()}
          >
            <PlusIcon className="size-4" />
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {children}
      </div>
    </div>
  );
}

type ViewProps = {
  byDate: Map<string, Ev[]>;
  openAdd: (dateKey: string, hour?: number) => void;
  remove: (id: number) => void;
};

function MonthView({
  cursor,
  byDate,
  openAdd,
  remove,
}: ViewProps & { cursor: Date }) {
  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
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
      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
        {days.map((day) => {
          const dk = keyOf(day);
          const list = byDate.get(dk) ?? [];
          const inMonth = isSameMonth(day, cursor);
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
                    title={`${timeLabel(e.start)} ${e.title} — click to remove`}
                    className={cn(
                      "flex items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[11px] transition-opacity hover:opacity-90",
                      chipFor(e.color),
                    )}
                  >
                    <span className="tabular-nums opacity-80">{e.start}</span>
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
  );
}

function TimeGridView({
  days,
  byDate,
  openAdd,
  remove,
}: ViewProps & { days: Date[] }) {
  const nowTopRem = ((today.getHours() * 60 + today.getMinutes()) / 60) * HOUR_REM;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const hasToday = days.some((d) => isSameDay(d, today));
  // Scroll the current time into view (centered) whenever this grid is shown.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || !hasToday) return;
    el.scrollTop = Math.max(0, nowTopRem * 16 - el.clientHeight / 2);
  }, [hasToday, nowTopRem]);
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Day header */}
      <div className="flex shrink-0 border-b border-border bg-muted/40">
        <div className="w-16 shrink-0" />
        {days.map((day) => (
          <div key={keyOf(day)} className="flex-1 px-2 py-1.5 text-center">
            <div className="text-xs font-medium text-muted-foreground">
              {format(day, "EEE")}
            </div>
            <div className={cnDate(true, isToday(day))}>{format(day, "d")}</div>
          </div>
        ))}
      </div>
      {/* Scrollable hour grid */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex">
          {/* Time gutter */}
          <div className="w-16 shrink-0">
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-14 border-b border-r border-border pr-1 pt-0.5 text-right text-[11px] tabular-nums text-muted-foreground"
              >
                {hourLabel(h)}
              </div>
            ))}
          </div>
          {/* Day columns */}
          <div className="relative flex flex-1">
            {days.some((d) => isSameDay(d, today)) && (
              <div
                className="pointer-events-none absolute inset-x-0 z-20 border-t-2 border-red-500"
                style={{ top: `${nowTopRem}rem` }}
              >
                <span className="absolute -left-1 -top-1 size-2 rounded-full bg-red-500" />
              </div>
            )}
            {days.map((day) => {
              const dk = keyOf(day);
              const list = byDate.get(dk) ?? [];
              return (
                <div key={dk} className="relative flex-1 border-l border-border">
                  {/* Background hour cells (click to add) */}
                  {HOURS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => openAdd(dk, h)}
                      aria-label={`Add appointment on ${format(day, "d MMM")} at ${hourLabel(h)}`}
                      className="block h-14 w-full border-b border-border transition-colors hover:bg-accent/30"
                    />
                  ))}
                  {/* Event blocks, positioned by start–end; overlapping events
                      split into side-by-side columns (lane / colsInCluster). */}
                  {layoutDay(list).map(({ ev: e, lane, cols }) => {
                    const top = (toMin(e.start) / 60) * HOUR_REM;
                    const height = (Math.max(toMin(e.end) - toMin(e.start), 20) / 60) * HOUR_REM;
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => remove(e.id)}
                        title={`${timeLabel(e.start)} – ${timeLabel(e.end)} · ${e.title} — click to remove`}
                        style={{
                          top: `${top}rem`,
                          height: `${height}rem`,
                          left: `calc(${(lane / cols) * 100}% + 1px)`,
                          width: `calc(${(1 / cols) * 100}% - 2px)`,
                        }}
                        className={cn(
                          "absolute z-10 flex flex-col overflow-hidden rounded px-1 py-0.5 text-left text-[11px] leading-tight shadow-sm transition-opacity hover:opacity-90",
                          chipFor(e.color),
                        )}
                      >
                        <span className="truncate font-medium">{e.title}</span>
                        <span className="truncate tabular-nums opacity-80">
                          {timeLabel(e.start)} – {timeLabel(e.end)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Assign overlapping events to side-by-side lanes. Events that overlap in time
 *  share a "cluster"; within it each gets a lane, and all report the cluster's
 *  column count so widths divide evenly. */
function layoutDay(events: Ev[]): { ev: Ev; lane: number; cols: number }[] {
  const sorted = [...events].sort(
    (a, b) => toMin(a.start) - toMin(b.start) || toMin(a.end) - toMin(b.end),
  );
  const out: { ev: Ev; lane: number; cols: number }[] = [];
  let cluster: { ev: Ev; lane: number; end: number }[] = [];
  let clusterEnd = -1;
  const flush = () => {
    const cols = Math.max(1, ...cluster.map((c) => c.lane + 1));
    for (const c of cluster) out.push({ ev: c.ev, lane: c.lane, cols });
    cluster = [];
    clusterEnd = -1;
  };
  for (const ev of sorted) {
    const s = toMin(ev.start);
    const e = Math.max(toMin(ev.end), s + 20); // min height match
    if (cluster.length && s >= clusterEnd) flush();
    const used = new Set(cluster.filter((c) => c.end > s).map((c) => c.lane));
    let lane = 0;
    while (used.has(lane)) lane++;
    cluster.push({ ev, lane, end: e });
    clusterEnd = Math.max(clusterEnd, e);
  }
  flush();
  return out;
}

function cnTab(active: boolean): string {
  return cn(
    "rounded px-2.5 py-1 text-xs font-medium transition-colors",
    active
      ? "bg-[var(--button-primary)] text-[var(--button-primary-foreground)]"
      : "text-muted-foreground hover:text-foreground",
  );
}

function cnCell(inMonth: boolean): string {
  return cn(
    "group flex min-h-0 flex-col items-stretch overflow-hidden border-b border-r border-border p-1 transition-colors hover:bg-accent/30",
    inMonth ? "bg-card" : "bg-muted/30",
  );
}

function cnDate(inMonth: boolean, today_: boolean): string {
  return cn(
    "inline-flex size-6 items-center justify-center self-start rounded-full text-xs",
    today_
      ? "bg-[var(--button-primary)] font-semibold text-[var(--button-primary-foreground)]"
      : inMonth
        ? "text-foreground"
        : "text-muted-foreground",
  );
}
