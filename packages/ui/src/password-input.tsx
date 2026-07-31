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
  /** Character shown for each hidden character. Default `"*"`. */
  maskChar?: string;
}

/**
 * A password field that **masks with `*` (not the browser's bullets)** and has
 * an **eye toggle** to reveal the value. It behaves like {@link Input} (spread
 * `useFormFields` `bind(...)` onto it, pass `error` for the inline validation),
 * and owns its whole right edge so the reveal button and the error icon never
 * collide.
 *
 * How the asterisks work: the real value lives in a text input (so typing,
 * paste, and the caret all behave natively), the input's own text is made
 * transparent, and a monospace overlay draws one `maskChar` per character over
 * it. Trade-off: because it isn't `type="password"`, browser/password-manager
 * autofill won't recognise it. Use a plain `<Input type="password" />` when
 * native autofill matters more than the asterisk look.
 *
 * ```tsx
 * <Field label="Password" htmlFor="password" required>
 *   <PasswordInput id="password" {...f.bind("password")} error={f.errors.password} />
 * </Field>
 * ```
 */
export function PasswordInput({
  className,
  value,
  error,
  maskChar = "*",
  autoComplete = "current-password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const errorId = React.useId();
  const text = typeof value === "string" ? value : String(value ?? "");
  const invalid = Boolean(error);

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        value={value}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        className={cn(
          "font-mono",
          invalid ? "pr-16" : "pr-9",
          // Hide the real characters behind the asterisk overlay; keep the caret.
          !visible && "text-transparent caret-foreground selection:bg-transparent",
          className,
        )}
      />

      {/* Asterisk mask, drawn over the transparent input text. */}
      {!visible && (
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
