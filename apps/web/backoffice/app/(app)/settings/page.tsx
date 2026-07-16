"use client";

import * as React from "react";
import {
  BellIcon,
  DesktopIcon,
  GearIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@myviliha/vui-ui/avatar";
import { Button } from "@myviliha/vui-ui/button";
import { Checkbox } from "@myviliha/vui-ui/checkbox";
import { Input } from "@myviliha/vui-ui/input";
import { Select } from "@myviliha/vui-ui/select";
import { SetPageTitle } from "@/app/_components/set-page-title";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: DesktopIcon },
];

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  try {
    if (theme === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  } catch {
    // ignore storage failures
  }
}

function Section({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card",
        className,
      )}
    >
      <div className="rounded-t-lg border-b border-border bg-muted/40 px-4 py-3">
        <h2 className="font-medium">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-4">
      <label htmlFor={htmlFor} className="text-sm text-muted-foreground">
        {label}
      </label>
      <div className="min-w-0 max-w-sm">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [theme, setTheme] = React.useState<Theme>("system");
  const [name, setName] = React.useState("Admin User");
  const [email, setEmail] = React.useState("admin@viliha.example");
  const [role, setRole] = React.useState("administrator");
  const [notifyEmail, setNotifyEmail] = React.useState(true);
  const [notifyDesktop, setNotifyDesktop] = React.useState(false);
  const [notifyWeekly, setNotifyWeekly] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      setTheme(stored ?? "system");
    } catch {
      // ignore
    }
  }, []);

  function chooseTheme(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  function save() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Settings" icon={GearIcon} />

      {/* Sub-toolbar */}
      <div className="flex shrink-0 items-center border-b border-border px-4 py-1.5 text-muted-foreground">
        Manage your profile, appearance, and notification preferences.
      </div>

      {/* Content — uniform spacing between sections and the save bar */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="grid gap-4 lg:grid-cols-2">
          <Section
            title="Profile"
            description="Your personal information."
            className="lg:col-span-2"
          >
            <div className="space-y-4 sm:max-w-xl">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <Button>Change avatar</Button>
              </div>
              <Field label="Name" htmlFor="name">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Role" htmlFor="role">
                <Select
                  id="role"
                  ariaLabel="Role"
                  value={role}
                  onValueChange={setRole}
                  options={[
                    { value: "administrator", label: "Administrator" },
                    { value: "manager", label: "Manager" },
                    { value: "member", label: "Member" },
                    { value: "viewer", label: "Viewer" },
                  ]}
                />
              </Field>
            </div>
          </Section>

          <Section title="Appearance" description="Choose how the app looks.">
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map((opt) => {
                const active = theme === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => chooseTheme(opt.value)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
                      active
                        ? "border-ring bg-accent"
                        : "border-border hover:bg-accent/50",
                    )}
                  >
                    <Icon className="size-5" />
                    <span className="text-sm">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section
            title="Notifications"
            description="Pick what you want to hear about."
          >
            <div className="space-y-3">
              <label
                htmlFor="notify-email"
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  id="notify-email"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                />
                <BellIcon className="size-3.5 text-muted-foreground" />
                Email notifications
              </label>
              <label
                htmlFor="notify-desktop"
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  id="notify-desktop"
                  checked={notifyDesktop}
                  onChange={(e) => setNotifyDesktop(e.target.checked)}
                />
                <DesktopIcon className="size-3.5 text-muted-foreground" />
                Desktop notifications
              </label>
              <label
                htmlFor="notify-weekly"
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  id="notify-weekly"
                  checked={notifyWeekly}
                  onChange={(e) => setNotifyWeekly(e.target.checked)}
                />
                Weekly summary email
              </label>
            </div>
          </Section>

          </div>
          <div className="flex items-center justify-end gap-2">
            {saved && (
              <span className="text-sm text-muted-foreground">Saved ✓</span>
            )}
            <Button variant="primary" onClick={save}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
