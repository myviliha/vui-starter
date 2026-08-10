"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/* Marketing forms: newsletter and contact.
 *
 * **Where the data goes.** These blocks ship with no endpoint, because a static
 * site has none. Pass `onSubmit` and do whatever you like, or pass `action` and
 * let the browser post to Formspree, Basin, a Worker or your own API. With
 * neither, the form validates, shows its success state, and tells you in the
 * console that nothing was sent — visibly inert rather than quietly dropping a
 * customer's message.
 */

export type FieldState = "default" | "error" | "success" | "disabled" | "loading";

export interface FieldProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute | "textarea";
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  rows?: number;
  /** Help text under the control. Replaced by the error when there is one. */
  hint?: string;
  error?: string;
  /** Marks the field as valid, for a form that validates as you type. */
  valid?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  className?: string;
}

/**
 * One labelled control, covering every state the design system defines:
 * default, focus, filled, error, success, disabled, loading and required.
 *
 * `aria-invalid` does the work for the error state: the border and ring turn
 * destructive from the token rules, without a second class to keep in step.
 */
export function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
  rows = 4,
  hint,
  error,
  valid,
  disabled,
  defaultValue,
  className,
}: FieldProps) {
  const id = React.useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const control = cn(
    "w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors",
    "placeholder:text-muted-foreground",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    error ? "border-destructive" : valid ? "border-emerald-500" : "border-input",
    type === "textarea" ? "min-h-24" : "h-9",
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium">
        {label}
        {required && (
          <>
            <span aria-hidden className="text-destructive">*</span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={control}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={control}
        />
      )}

      {error ? (
        // Announced, because a sighted user sees the red border and a screen
        // reader user must be told the same thing.
        <p id={`${id}-error`} role="alert" className="text-caption text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-caption text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Submit button with a loading state that keeps its width, so nothing jumps. */
export function SubmitButton({
  children,
  loading,
  disabled,
  className,
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-[var(--button-primary)] px-4 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] transition-colors",
        "hover:bg-[var(--button-primary-hover)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
    >
      {loading && (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="vui-icon-plain size-4 animate-spin motion-reduce:animate-none">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
}

type SubmitState = "idle" | "loading" | "success" | "error";

function useFormSubmit(onSubmit?: (data: FormData) => void | Promise<void>) {
  const [state, setState] = React.useState<SubmitState>("idle");
  const [message, setMessage] = React.useState("");

  const handle = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!onSubmit) {
      // No handler and no action: let the browser do nothing, but say so rather
      // than pretending the message was sent.
      event.preventDefault();
      setState("success");
      setMessage("");
      console.warn(
        "[vui-web] This form has no `onSubmit` and no `action`, so nothing was sent. Wire one up before shipping.",
      );
      return;
    }
    event.preventDefault();
    setState("loading");
    try {
      await onSubmit(new FormData(event.currentTarget));
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return { state, message, handle };
}

export interface NewsletterProps {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  eyebrow?: React.ReactNode;
  buttonLabel?: string;
  placeholder?: string;
  /** Under the field: what they are signing up for, how to unsubscribe. */
  footnote?: React.ReactNode;
  successMessage?: string;
  /** Native form target, for Formspree and friends. */
  action?: string;
  method?: "post" | "get";
  onSubmit?: (data: FormData) => void | Promise<void>;
  /** `compact` is the one-line version for a footer. */
  variant?: "section" | "compact";
  tone?: SectionTone;
  className?: string;
}

export function Newsletter({
  title = "Subscribe to the newsletter",
  lead,
  eyebrow,
  buttonLabel = "Subscribe",
  placeholder = "you@example.com",
  footnote,
  successMessage = "Thanks. Check your inbox to confirm.",
  action,
  method = "post",
  onSubmit,
  variant = "section",
  tone,
  className,
}: NewsletterProps) {
  const { state, message, handle } = useFormSubmit(action ? undefined : onSubmit ?? (() => {}));

  const form = (
    <form
      action={action}
      method={action ? method : undefined}
      onSubmit={action ? undefined : handle}
      className="flex w-full max-w-md flex-col gap-2"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="vui-newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="vui-newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          disabled={state === "loading"}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none disabled:opacity-50"
        />
        <SubmitButton loading={state === "loading"}>{buttonLabel}</SubmitButton>
      </div>
      {state === "success" && (
        <p role="status" className="text-caption text-emerald-600 dark:text-emerald-400">
          {successMessage}
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="text-caption text-destructive">
          {message}
        </p>
      )}
      {footnote && state === "idle" && <p className="text-caption text-muted-foreground">{footnote}</p>}
    </form>
  );

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-col gap-3 md:flex-row md:items-center md:justify-between", className)}>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{title}</p>
          {lead && <p className="text-sm text-muted-foreground">{lead}</p>}
        </div>
        {form}
      </div>
    );
  }

  return (
    <Section tone={tone} width="md" className={className}>
      <div className="flex flex-col items-center gap-6 text-center">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" size="h2" />
        <div className="flex justify-center">{form}</div>
      </div>
    </Section>
  );
}

export interface ContactFormProps {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Address, phone, hours: rendered beside the form. */
  aside?: React.ReactNode;
  fields?: FieldProps[];
  buttonLabel?: string;
  successMessage?: string;
  action?: string;
  method?: "post" | "get";
  onSubmit?: (data: FormData) => void | Promise<void>;
  tone?: SectionTone;
  className?: string;
}

const DEFAULT_FIELDS: FieldProps[] = [
  { label: "Name", name: "name", required: true, autoComplete: "name" },
  { label: "Email", name: "email", type: "email", required: true, autoComplete: "email" },
  { label: "Company", name: "company", autoComplete: "organization" },
  { label: "How can we help?", name: "message", type: "textarea", required: true },
];

export function ContactForm({
  title = "Talk to us",
  lead,
  eyebrow,
  aside,
  fields = DEFAULT_FIELDS,
  buttonLabel = "Send message",
  successMessage = "Thanks. We reply within one business day.",
  action,
  method = "post",
  onSubmit,
  tone,
  className,
}: ContactFormProps) {
  const { state, message, handle } = useFormSubmit(action ? undefined : onSubmit ?? (() => {}));

  return (
    <Section tone={tone} className={className}>
      <div className={cn("grid gap-10", aside && "md:grid-cols-[minmax(0,1fr)_20rem]")}>
        <div className="flex flex-col gap-6">
          <SectionHeader eyebrow={eyebrow} title={title} lead={lead} size="h2" />
          {state === "success" ? (
            <p
              role="status"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.07] px-4 py-3 text-sm text-foreground"
            >
              {successMessage}
            </p>
          ) : (
            <form
              action={action}
              method={action ? method : undefined}
              onSubmit={action ? undefined : handle}
              className="flex flex-col gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <Field
                    key={f.name}
                    {...f}
                    disabled={f.disabled || state === "loading"}
                    className={f.type === "textarea" ? "sm:col-span-2" : undefined}
                  />
                ))}
              </div>
              {state === "error" && (
                <p role="alert" className="text-caption text-destructive">
                  {message}
                </p>
              )}
              <div>
                <SubmitButton loading={state === "loading"}>{buttonLabel}</SubmitButton>
              </div>
            </form>
          )}
        </div>
        {aside && <div className="flex flex-col gap-4">{aside}</div>}
      </div>
    </Section>
  );
}
