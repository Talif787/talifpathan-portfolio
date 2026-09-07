import { cn } from "@/lib/utils";

export function Chip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn("chip", className)}>{children}</span>;
}

export function ChipList({
  items,
  label,
}: {
  items: readonly string[];
  label: string;
}) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2xs">
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}
