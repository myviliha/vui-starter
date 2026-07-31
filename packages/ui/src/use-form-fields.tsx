"use client";

import * as React from "react";

/**
 * A per-field validation rule. Return an error message string when the value is
 * invalid, or `undefined` (or a falsy value) when it's fine. The second
 * argument is every field's current value, for cross-field rules (e.g. a
 * "confirm password" that must equal `values.password`).
 */
export type FieldRule = (
  value: string,
  values: Record<string, string>,
) => string | undefined | null | false;

/**
 * Reusable inline-validation for text `Input` / `Textarea` fields.
 *
 * Validation runs at two moments and surfaces through **one** channel only, the
 * field's own inline error (red border + alert-triangle tooltip via `Field`):
 *
 *   1. **on blur** (the user leaves the field), and
 *   2. **on submit** (`validate()` checks every field).
 *
 * The error clears the moment the user edits the field, and re-checks on the
 * next blur or submit. There is no separate error banner, and you should set
 * `noValidate` on the `<form>` so the browser's native bubble ("Please include
 * an '@'…") never competes with this one.
 *
 * ```tsx
 * const f = useFormFields({
 *   email:    (v) => (!EMAIL_RE.test(v.trim()) ? "Enter a valid email address." : undefined),
 *   password: (v) => (v.length < 8 ? "Password must be at least 8 characters." : undefined),
 * });
 *
 * <form noValidate onSubmit={(e) => { e.preventDefault(); if (!f.validate()) return; submit(f.values); }}>
 *   <Field label="Email" htmlFor="email" required error={f.errors.email}>
 *     <Input id="email" {...f.bind("email")} />
 *   </Field>
 *   <Field label="Bio" htmlFor="bio" error={f.errors.bio} multiline>
 *     <Textarea id="bio" {...f.bind("bio")} />
 *   </Field>
 * </form>
 * ```
 */
export function useFormFields<K extends string>(
  rules: Record<K, FieldRule>,
  initialValues?: Partial<Record<K, string>>,
) {
  const keys = React.useMemo(() => Object.keys(rules) as K[], [rules]);

  const [values, setValues] = React.useState<Record<K, string>>(() => {
    const seed = {} as Record<K, string>;
    for (const k of Object.keys(rules) as K[]) seed[k] = initialValues?.[k] ?? "";
    return seed;
  });
  const [errors, setErrors] = React.useState<Partial<Record<K, string>>>({});

  // Latest rules without resubscribing the callbacks each render.
  const rulesRef = React.useRef(rules);
  rulesRef.current = rules;
  const run = (
    k: K,
    value: string,
    all: Record<K, string>,
  ): string | undefined => rulesRef.current[k](value, all) || undefined;

  const setValue = React.useCallback((k: K, value: string) => {
    setValues((v) => ({ ...v, [k]: value }));
    // Clear the error on edit; it re-checks on the next blur / submit.
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  }, []);

  /** Spread onto an `Input` / `Textarea`: value + onChange + onBlur. */
  const bind = React.useCallback(
    (k: K) => ({
      value: values[k],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setValue(k, e.target.value),
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setErrors((prev) => ({
          ...prev,
          [k]: run(k, e.target.value, { ...values, [k]: e.target.value }),
        })),
    }),
    [values, setValue],
  );

  /** Validate every field. Returns true when all pass; sets all inline errors. */
  const validate = React.useCallback((): boolean => {
    const next: Partial<Record<K, string>> = {};
    let ok = true;
    for (const k of keys) {
      const msg = run(k, values[k], values);
      next[k] = msg;
      if (msg) ok = false;
    }
    setErrors(next);
    return ok;
  }, [keys, values]);

  /** Set (or clear) a field's error by hand, e.g. a server "invalid credentials"
   *  reply, surfaced through the same inline channel as validation. */
  const setError = React.useCallback((k: K, message?: string) => {
    setErrors((e) => ({ ...e, [k]: message || undefined }));
  }, []);

  const reset = React.useCallback(() => {
    const seed = {} as Record<K, string>;
    for (const k of keys) seed[k] = initialValues?.[k] ?? "";
    setValues(seed);
    setErrors({});
  }, [keys, initialValues]);

  return { values, errors, bind, setValue, setError, validate, reset };
}
