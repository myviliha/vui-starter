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
import { Avatar, AvatarFallback } from "@viliha/vui-ui/avatar";
import { Button } from "@viliha/vui-ui/button";
import { Checkbox } from "@viliha/vui-ui/checkbox";
import { Input } from "@viliha/vui-ui/input";
import { Select } from "@viliha/vui-ui/select";
import { Switch } from "@viliha/vui-ui/switch";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";
import { useChromeConfig } from "@/app/_components/chrome-config";
import { useVuiPreferences } from "@viliha/vui-ui/config";
import { useThemeConfig } from "@viliha/vui-ui/theme-provider";
import {
  CHROME_FEATURES,
  DATA_TABLE_PREFERENCE_FIELDS,
  THEME_CHOICES,
} from "@/lib/app-config";

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
      className={cn("overflow-hidden rounded-lg border border-border", className)}
    >
      <div className="border-b border-border bg-muted/40 px-3 py-2">
        <h2 className="font-semibold text-[var(--button-primary)]">{title}</h2>
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
  const { chrome, setFeature, reset } = useChromeConfig();
  const prefs = useVuiPreferences();
  const themeConfig = useThemeConfig();

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

      {/* Breadcrumb bar — matches the record form pages. */}
      <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
        <Breadcrumbs />
      </div>

      {/* Content — padded, bordered card with a fixed footer (matches the add form). */}
      <div className="min-h-0 flex-1 overflow-hidden p-4">
        <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
          <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            <div className="w-full space-y-4">
          <Section title="Profile" description="Your personal information.">
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
            title="Top bar"
            description="Show or hide top-bar features. Changes apply instantly and are saved to this browser."
          >
            <div className="space-y-3 sm:max-w-xl">
              {CHROME_FEATURES.map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{f.label}</p>
                    <p className="text-sm text-muted-foreground">{f.hint}</p>
                  </div>
                  <Switch
                    checked={chrome[f.key]}
                    onCheckedChange={(on) => setFeature(f.key, on)}
                    aria-label={f.label}
                  />
                </div>
              ))}
              <div className="pt-1">
                <Button variant="outline" onClick={reset}>
                  Reset to defaults
                </Button>
              </div>
            </div>
          </Section>

          <Section
            title="Theme"
            description="Your own colour, font and shape. The organization sets the defaults; anything you change here is yours and follows only you."
          >
            <div className="space-y-4 sm:max-w-xl">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Primary color</p>
                  <p className="text-sm text-muted-foreground">
                    Buttons, links, focus rings and the active nav item.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {themeConfig?.presets.map((preset) => {
                    const color = preset.theme.brand;
                    const active = themeConfig.theme.brand === color;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => themeConfig.applyPreset(preset.id)}
                        aria-label={preset.label}
                        aria-pressed={active}
                        title={preset.label}
                        className={cn(
                          "size-7 cursor-pointer rounded-full ring-offset-2 ring-offset-background transition-shadow",
                          active
                            ? "ring-2 ring-foreground"
                            : "ring-1 ring-border hover:ring-foreground/40",
                        )}
                        style={{ backgroundColor: color }}
                      />
                    );
                  })}
                </div>
              </div>

              {THEME_CHOICES.map((f) => (
                <div key={f.key} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{f.label}</p>
                    <p className="text-sm text-muted-foreground">{f.hint}</p>
                  </div>
                  <Select
                    className="w-48 shrink-0"
                    aria-label={f.label}
                    value={themeConfig?.userTheme[f.key] ?? ""}
                    onValueChange={(v) => themeConfig?.setValue(f.key, v)}
                    options={f.options}
                    placeholder="Organization default"
                  />
                </div>
              ))}

              <div className="flex items-center gap-3 pt-1">
                <Button variant="outline" onClick={() => themeConfig?.reset()}>
                  Reset to organization theme
                </Button>
                {themeConfig?.saving && (
                  <span className="text-sm text-muted-foreground">Saving…</span>
                )}
              </div>
            </div>
          </Section>

          <Section
            title="Data tables"
            description="How record lists behave for you. Saved to this browser, and only these are yours to change: the rest of the layout is the app's."
          >
            <div className="space-y-3 sm:max-w-xl">
              {DATA_TABLE_PREFERENCE_FIELDS.map((f) => {
                const current = prefs?.preferences.behaviour?.[f.key];
                return (
                  <div
                    key={f.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{f.label}</p>
                      <p className="text-sm text-muted-foreground">{f.hint}</p>
                    </div>
                    <Select
                      className="w-48 shrink-0"
                      aria-label={f.label}
                      value={current == null ? "" : String(current)}
                      onValueChange={(v) =>
                        prefs?.setPreference(
                          "behaviour",
                          f.key,
                          f.key === "flashMs"
                            ? Number(v)
                            : f.key === "confirmDelete"
                              ? v === "true"
                              : v,
                        )
                      }
                      options={f.options}
                      placeholder="App default"
                    />
                  </div>
                );
              })}
              <div className="pt-1">
                <Button variant="outline" onClick={() => prefs?.reset()}>
                  Reset to defaults
                </Button>
              </div>
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
          </div>
          {/* Fixed footer — matches the add form's action bar. */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-y border-border bg-muted/40 px-4 py-3">
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
