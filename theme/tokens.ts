export const tokens = {
  colors: {
    background: "#0b0b0f",
    foreground: "#ececec",
    primary: "#7c3aed",
    secondary: "#06b6d4",
    muted: "#1a1a1f",
    border: "#2a2a31",
    warning: "#f59e0b",
    error: "#ef4444",
    success: "#22c55e",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    round: "9999px",
  },
  typography: {
    fontSansVar: "var(--font-geist-sans)",
    fontMonoVar: "var(--font-geist-mono)",
    baseSize: "16px",
    scale: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      display: "32px",
    },
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;

export type ThemeTokens = typeof tokens;
