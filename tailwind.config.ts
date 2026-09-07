import type { Config } from "tailwindcss";

/**
 * Tailwind consumes the tokens declared in app/globals.css rather than
 * redefining them. Editing a token changes both utility classes and raw CSS.
 */
const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--c-base)",
        "base-deep": "var(--c-base-deep)",
        scrim: "var(--c-scrim)",
        surface: "var(--c-surface)",
        "surface-raised": "var(--c-surface-raised)",
        line: "var(--c-line)",
        "line-faint": "var(--c-line-faint)",
        "line-strong": "var(--c-line-strong)",
        ink: "var(--c-text)",
        muted: "var(--c-text-muted)",
        faint: "var(--c-text-faint)",
        accent: "var(--c-accent)",
        "accent-quiet": "var(--c-accent-quiet)",
        "accent-line": "var(--c-accent-line)",
        signal: "var(--c-signal)",
        ok: "var(--c-ok)",
        warn: "var(--c-warn)",
        error: "var(--c-error)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": ["var(--step--2)", { lineHeight: "1.5" }],
        xs: ["var(--step--1)", { lineHeight: "1.55" }],
        base: ["var(--step-0)", { lineHeight: "1.6" }],
        lg: ["var(--step-1)", { lineHeight: "1.45" }],
        xl: ["var(--step-2)", { lineHeight: "1.3" }],
        "2xl": ["var(--step-3)", { lineHeight: "1.2" }],
        "3xl": ["var(--step-4)", { lineHeight: "1.14" }],
        "4xl": ["var(--step-5)", { lineHeight: "1.08" }],
        display: ["var(--step-6)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
      },
      spacing: {
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        s: "var(--space-s)",
        m: "var(--space-m)",
        l: "var(--space-l)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        section: "var(--section-y)",
        gutter: "var(--gutter)",
      },
      borderRadius: {
        inline: "var(--r-inline)",
        node: "var(--r-node)",
        sheet: "var(--r-sheet)",
        panel: "var(--r-panel)",
        chip: "var(--r-chip)",
      },
      boxShadow: {
        sheet: "var(--shadow-sheet)",
        lift: "var(--shadow-lift)",
        panel: "var(--shadow-panel)",
      },
      transitionTimingFunction: {
        entrance: "var(--ease-entrance)",
        exit: "var(--ease-exit)",
        standard: "var(--ease-standard)",
      },
      transitionDuration: {
        micro: "var(--dur-micro)",
        press: "var(--dur-press)",
        ui: "var(--dur-ui)",
        card: "var(--dur-card)",
        panel: "var(--dur-panel)",
      },
      maxWidth: {
        shell: "78rem",
        measure: "var(--measure)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
