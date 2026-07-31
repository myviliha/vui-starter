"use client";

import * as React from "react";
import {
  ExclamationTriangleIcon,
  EyeNoneIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";

import { cn } from "./utils";
import { Input } from "./input";
import { Tooltip } from "./tooltip";

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /** Inline validation message: red border + alert-triangle tooltip. Falsy = valid. */
  error?: string;
  /** Character shown for each hidden character in `"asterisk"` mode. Default `"*"`. */
  maskChar?: string;
  /**
   * How the value is hidden. Default `"asterisk"`.
   *
   * - `"asterisk"` draws `maskChar` over a text input, so it masks with `*`
   *   instead of the browser's bullet dots. Trade-off: it isn't
   *   `type="password"`, so browser / password-manager autofill won't recognise
   *   it and screen readers can read the value.
   * - `"native"` uses a real `type="password"` (bullet dots) that the eye toggle
   *   flips to `type="text"`. Autofill and password managers work normally.
   *   Prefer this when native behaviour matters more than the asterisk look.
   */
  mask?: "asterisk" | "native";
}

/**
 * A password field with a **show/hide eye toggle**. By default it masks with
 * `*` (`mask="asterisk"`); pass `mask="native"` for the browser's native
 * bullet-dot password field (better autofill). It's a drop-in for {@link Input}
 * inside a `Field`: spread `useFormFields` `bind(...)` onto it and pass `error`.
 *
 * ```tsx
 * <Field label="Password" htmlFor="password" required>
 *   <PasswordInput id="password" {...f.bind("password")} error={f.errors.password} />
 * </Field>
 *
 * <PasswordInput mask="native" {...f.bind("password")} />   // native bullets + autofill
 * ```
 */
export function PasswordInput({
  className,
  value,
  error,
  maskChar = "*",
  mask = "asterisk",
  autoComplete = "current-password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const errorId = React.useId();
  const text = typeof value === "string" ? value : String(value ?? "");
  const invalid = Boolean(error);
  const asterisk = mask === "asterisk";
  // Asterisk mode masks with the overlay while hidden; native mode toggles type.
  const showOverlay = asterisk && !visible;

  return (
    <div className="relative">
      <Input
        {...props}
        type={asterisk ? "text" : visible ? "text" : "password"}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        className={cn(
          invalid ? "pr-16" : "pr-9",
          asterisk && "font-mono",
          // Hide the real characters behind the asterisk overlay; keep the caret.
          showOverlay && "text-transparent caret-foreground selection:bg-transparent",
          className,
        )}
      />

      {/* Asterisk mask, drawn over the transparent input text. */}
      {showOverlay && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-pre px-2.5 font-mono text-foreground"
        >
          {maskChar.repeat(text.length)}
        </span>
      )}

      {/* Error icon + tooltip, to the left of the reveal button. */}
      {invalid && (
        <>
          <Tooltip
            content={error}
            className="absolute right-9 top-1/2 -translate-y-1/2 text-destructive"
          >
            <ExclamationTriangleIcon className="size-4" aria-hidden="true" />
          </Tooltip>
          <span id={errorId} className="sr-only">
            {error}
          </span>
        </>
      )}

      {/* Reveal toggle. */}
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
      >
        {visible ? (
          <EyeNoneIcon className="size-4" />
        ) : (
          <EyeOpenIcon className="size-4" />
        )}
      </button>
    </div>
  );
}
