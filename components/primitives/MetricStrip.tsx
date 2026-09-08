import type { Metric } from "@/content";
import { cn } from "@/lib/utils";

/**
 * Headline figures. Every value here traces to a documented fact in the source
 * material; nothing is computed, projected or rounded up.
 */
export function MetricStrip({
  metrics,
  label,
  className,
}: {
  metrics: Metric[];
  label: string;
  className?: string;
}) {
  return (
    <dl aria-label={label} className={cn("metrics", className)}>
      {metrics.map((metric) => (
        <div key={metric.label} className="metric">
          <dt className="sr-only">{metric.label}</dt>
          <dd>
            <span className="metric-value">{metric.value}</span>
            <span className="metric-label" aria-hidden>
              {metric.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
