import type { Config } from "tailwindcss";

/**
 * Every value here points at a CSS variable declared in src/app/globals.css.
 * Pages compose utilities (bg-surface, text-secondary, rounded-card,
 * shadow-card) so the visual system can be retuned in one place.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        elevated: "var(--surface-elevated)",
        white: "var(--white)",
        sage: {
          50: "var(--sage-50)",
          100: "var(--sage-100)",
          200: "var(--sage-200)",
          300: "var(--sage-300)",
          400: "var(--sage-400)",
          500: "var(--sage-500)",
          600: "var(--sage-600)",
          700: "var(--sage-700)",
          800: "var(--sage-800)",
        },
        ink: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        border: "var(--border)",
        "border-light": "var(--border-light)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      borderRadius: {
        tiny: "6px",
        button: "9px",
        input: "10px",
        card: "12px",
        panel: "14px",
        shell: "16px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        pop: "var(--shadow-pop)",
        focus: "var(--focus-ring)",
      },
      fontSize: {
        // §3 typography hierarchy — no giant type anywhere.
        micro: ["11px", { lineHeight: "1.45" }],
        meta: ["12px", { lineHeight: "1.5" }],
        body: ["13px", { lineHeight: "1.6" }],
        "body-lg": ["14px", { lineHeight: "1.6" }],
        "card-title": ["15px", { lineHeight: "1.4" }],
        section: ["17px", { lineHeight: "1.35" }],
        page: ["29px", { lineHeight: "1.2" }],
        reader: ["16px", { lineHeight: "1.75" }],
      },
      fontWeight: {
        heading: "650",
      },
      spacing: {
        // §34 spacing scale, plus the fixed shell measurements.
        "1.5": "6px",
        "4.5": "18px",
        "5.5": "22px",
        "7.5": "30px",
        sidebar: "240px",
        contents: "230px",
        actions: "208px",
        nav: "42px",
        bottomnav: "66px",
      },
      maxWidth: {
        shell: "1400px",
        reader: "760px",
      },
      transitionTimingFunction: {
        calm: "var(--ease)",
      },
      transitionDuration: {
        calm: "180ms",
      },
    },
  },
  plugins: [],
};
export default config;
