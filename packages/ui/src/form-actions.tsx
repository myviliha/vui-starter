"use client";

import * as React from "react";
import {
  CheckIcon as Check,
  Cross2Icon as X,
  Pencil1Icon as Pencil,
} from "@radix-ui/react-icons";

import { Button } from "./button";
import { ConfirmDialog } from "./confirm-dialog";
import {
  type BehaviourConfig,
  type FormAction,
  type FormActionContext,
  type FormActionOutcome,
  type FormActionsConfig,
} from "./config";

/**
 * The footer buttons the theme ships: Cancel + Save while editing, Close + Edit
 * while viewing. They are ordinary {@link FormAction}s, which is the point — a
 * host changes them with the same API that builds them, and anything it doesn't
 * mention keeps working.
 */
export function defaultFormActions<T>({
  readOnly,
  canEdit,
}: {
  readOnly: boolean;
  canEdit: boolean;
}): FormAction<T>[] {
  // These return `false` ("I handled it") so the caller doesn't close on top of
  // what they already did. Save is the exception: it returns nothing, which is
  // what makes the caller commit the draft and close.
  if (readOnly) {
    const actions: FormAction<T>[] = [
      {
        id: "close",
        label: "Close",
        icon: X,
        onAct: (ctx) => {
          ctx.close();
          return false;
        },
      },
    ];
    if (canEdit)
      actions.push({
        id: "edit",
        label: "Edit",
        icon: Pencil,
        variant: "primary",
        // Switching to edit keeps the form open, and edits nothing yet.
        requiresValid: false,
        onAct: (ctx) => {
          ctx.edit?.();
          return false;
        },
      });
    return actions;
  }
  return [
    {
      id: "cancel",
      label: "Cancel",
      icon: X,
      onAct: (ctx) => {
        ctx.close();
        return false;
      },
    },
    { id: "save", label: "Save", icon: Check, variant: "primary", onAct: () => {} },
  ];
}

/**
 * Apply a host's `actions` config to the shipped list. An array replaces it; a
 * function receives the defaults and returns the list it wants.
 */
export function resolveFormActions<T>(
  defaults: FormAction<T>[],
  config: FormActionsConfig<T> | undefined,
): FormAction<T>[] {
  if (!config) return defaults;
  return typeof config === "function" ? config(defaults) : config;
}

/**
 * What the form does after a successful save: the acting button's `after` if it
 * named one, otherwise `behaviour.closeOnSave`. One helper so the form and the
 * table can't disagree about it.
 */
export function saveOutcome(
  after: FormActionOutcome | undefined,
  behaviour: BehaviourConfig | undefined,
): FormActionOutcome {
  return after ?? ((behaviour?.closeOnSave ?? true) ? "close" : "stay");
}

/** An action validates first when it says so, and by default when it's primary. */
export const actionRequiresValid = <T,>(action: FormAction<T>): boolean =>
  action.requiresValid ?? action.variant === "primary";

/**
 * The form footer. Renders the resolved actions, keeps `align: "start"` ones on
 * the left, and owns the confirm dialog and the busy state while an async action
 * settles.
 *
 * `onAct` is wrapped by the caller (`run`), which is where validation and the
 * save path live — this component only decides what a click means.
 */
export function FormFooter<T>({
  actions,
  ctx,
  run,
  className,
}: {
  actions: FormAction<T>[];
  ctx: FormActionContext<T>;
  /** Perform one action: validate if it needs to, act, then close unless the
   *  action returned `false`. */
  run: (action: FormAction<T>) => void | Promise<void>;
  className?: string;
}) {
  const [confirming, setConfirming] = React.useState<FormAction<T> | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const visible = actions.filter((a) => a.visible?.(ctx) ?? true);
  const start = visible.filter((a) => a.align === "start");
  const end = visible.filter((a) => a.align !== "start");

  const act = async (action: FormAction<T>) => {
    setBusy(action.id);
    try {
      await run(action);
    } finally {
      setBusy(null);
    }
  };

  const button = (action: FormAction<T>) => {
    const Icon = action.icon;
    return (
      <Button
        key={action.id}
        type="button"
        variant={action.variant}
        disabled={busy !== null || (action.disabled?.(ctx) ?? false)}
        onClick={() =>
          action.confirm ? setConfirming(action) : void act(action)
        }
      >
        {Icon && <Icon className="size-4" />}
        {action.label}
      </Button>
    );
  };

  return (
    <>
      <div
        className={
          className ??
          "flex shrink-0 items-center gap-2 border-y border-border bg-muted/40 px-4 py-3"
        }
      >
        {start.map(button)}
        <div className="ml-auto flex items-center gap-2">{end.map(button)}</div>
      </div>
      {confirming && (
        <ConfirmDialog
          open
          title={confirming.confirm!.title}
          description={confirming.confirm!.body}
          confirmLabel={confirming.confirm!.confirmLabel ?? confirming.label}
          destructive={confirming.variant === "destructive"}
          onConfirm={() => {
            const action = confirming;
            setConfirming(null);
            void act(action);
          }}
          onCancel={() => setConfirming(null)}
        />
      )}
    </>
  );
}
