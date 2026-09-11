"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/primitives/Button";

type State = "idle" | "copied" | "error";

/**
 * Copy to clipboard with the three states the interaction actually has.
 *
 * The previous implementation set `copied` once and never reset it, and called
 * `navigator.clipboard` unguarded, which throws on insecure origins. This
 * resets after two seconds and falls back to selecting the address so the
 * reader can still copy it manually.
 */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("error");
    }
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  };

  const label =
    state === "copied"
      ? "Copied"
      : state === "error"
        ? "Select and copy the address"
        : "Copy email address";

  return (
    <div className="flex flex-col gap-xs">
      <Button
        type="button"
        onClick={copy}
        variant="secondary"
        aria-live="polite"
        data-state={state}
      >
        {state === "copied" ? (
          <Check aria-hidden className="size-4 text-ok" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
        {label}
      </Button>
      {state === "error" ? (
        <p className="text-2xs mono text-faint">
          <span className="select-all">{email}</span>
        </p>
      ) : null}
    </div>
  );
}
