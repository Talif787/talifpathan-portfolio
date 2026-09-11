import { cn } from "@/lib/utils";

/**
 * A status marker, not a fake uptime badge. The label is supplied from content
 * and describes a real fact about availability.
 */
export function StatusDot({
  label,
  tone = "ok",
  className,
}: {
  label: string;
  tone?: "ok" | "warn" | "neutral";
  className?: string;
}) {
  const toneClass =
    tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-faint";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs text-muted mono",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-chip", toneClass)} />
      {label}
    </span>
  );
}
