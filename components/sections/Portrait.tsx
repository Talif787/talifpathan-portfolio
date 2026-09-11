import Image from "next/image";
import { profile } from "@/content";
import { cn } from "@/lib/utils";

/**
 * The portrait, rendered only when one exists.
 *
 * Sized small and placed in the about column rather than the hero: a large
 * hero photograph is a designer and creative-director convention, and on a
 * systems portfolio it reads as personal brand rather than engineering.
 *
 * Served through next/image so it is converted to AVIF or WebP, resized per
 * breakpoint and given reserved space from the declared dimensions. This is the
 * only raster image on the site, and it stays that way: the original template
 * shipped 16.7MB of images and that was the single worst thing about it.
 *
 * A rounded rectangle at the sheet radius rather than a circle. Circles are the
 * default every portfolio reaches for; matching the surface radius already in
 * the design system costs nothing and looks deliberate.
 */
export function Portrait({ className }: { className?: string }) {
  const portrait = profile.portrait;
  if (!portrait) return null;

  return (
    <div className={cn("max-w-[14rem]", className)}>
      <Image
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        sizes="(min-width: 64rem) 14rem, 10rem"
        className="h-auto w-full rounded-sheet border border-line object-cover shadow-sheet"
      />
    </div>
  );
}
