import type { ArchitectureNode } from "@/content";
import { cn } from "@/lib/utils";

/**
 * The recurring motion motif: a request travelling through a system.
 *
 * Deliberately server-rendered. The pulse is a CSS keyframe on a compositor
 * friendly transform, the layout reflows through a container query rather than
 * a viewport breakpoint, and reduced motion freezes the pulse into a static
 * connector. No JavaScript reaches the client for this component.
 *
 * Nodes come from content/projects.ts. The diagram can only ever describe
 * components a project actually has.
 */
export function ArchitectureFlow({
  caption,
  nodes,
  className,
}: {
  caption: string;
  nodes: ArchitectureNode[];
  className?: string;
}) {
  const path = nodes.map((node) => node.label).join(" to ");

  return (
    <figure className={cn("flow", className)}>
      <figcaption className="mono mb-s text-2xs text-faint">{caption}</figcaption>
      <div className="flow-track" role="img" aria-label={`${caption}: ${path}`}>
        {nodes.map((node, index) => (
          <div key={node.id} className="contents">
            {index > 0 ? (
              <span
                aria-hidden
                className="flow-link"
                style={{ "--flow-index": index - 1 } as React.CSSProperties}
              />
            ) : null}
            <div className="flow-node" data-kind={node.kind}>
              <span className="flow-node-label">{node.label}</span>
              <span className="flow-node-detail">{node.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
