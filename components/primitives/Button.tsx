import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Buttons and link-buttons share one visual definition so a CTA looks the same
 * whether it navigates or acts. Press feedback is CSS: it must land before the
 * next frame, which is not something to route through React state.
 */
const buttonStyles = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-inline font-medium select-none",
    "transition-[background-color,border-color,color,box-shadow,transform]",
    "duration-ui ease-standard",
    "active:scale-[0.985] active:duration-press",
    "disabled:pointer-events-none disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-base-deep border border-accent hover:bg-[#ffc274] hover:shadow-lift",
        secondary:
          "border border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-raised",
        ghost:
          "border border-transparent text-muted hover:text-ink hover:border-line",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-base",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export type ButtonVariants = VariantProps<typeof buttonStyles>;

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export function LinkButton({
  className,
  variant,
  size,
  external = false,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonVariants & { external?: boolean }) {
  return (
    <a
      className={cn(buttonStyles({ variant, size }), "group", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}

export { buttonStyles };
