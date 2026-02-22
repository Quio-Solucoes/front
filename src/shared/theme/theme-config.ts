export type ThemeMode = "light" | "dark";
export type ThemePreference = ThemeMode | "system";

export type ThemeColors = {
  bg: string;
  surface: string;
  surfaceSoft: string;
  text: string;
  textMuted: string;
  line: string;
  brand: string;
  brandStrong: string;
  accent: string;
  danger: string;
  success: string;
  warning: string;
  info: string;
  bgGlowA: string;
  bgGlowB: string;
};

export type ThemeTypography = {
  familySans: string;
  familyMono: string;
  familyDisplay: string;
  sizeXs: string;
  sizeSm: string;
  sizeBase: string;
  sizeLg: string;
  sizeXl: string;
  size2xl: string;
  size3xl: string;
  weightRegular: string;
  weightMedium: string;
  weightSemibold: string;
  weightBold: string;
  weightBlack: string;
  lineTight: string;
  lineNormal: string;
  lineRelaxed: string;
  trackingTight: string;
  trackingNormal: string;
  trackingWide: string;
};

export type ThemeRadius = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  pill: string;
};

export type ThemeShadow = {
  sm: string;
  md: string;
  lg: string;
};

export type ThemeSpacing = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
};

export type ThemeMotion = {
  fast: string;
  normal: string;
  slow: string;
  easing: string;
};

export type ThemeTokens = {
  light: ThemeColors;
  dark: ThemeColors;
  typography: ThemeTypography;
  radius: ThemeRadius;
  shadow: ThemeShadow;
  spacing: ThemeSpacing;
  motion: ThemeMotion;
};

// Fonte unica para customizacao de tema.
// Edite aqui as cores, fontes e escalas globais do projeto.
export const themeTokens: ThemeTokens = {
  light: {
    bg: "#ebe9dd",
    surface: "#f8f6ee",
    surfaceSoft: "#f1eee3",
    text: "#1f1f1f",
    textMuted: "#5f5c52",
    line: "#d2cdbd",
    brand: "#447187",
    brandStrong: "#355b6d",
    accent: "#b88938",
    danger: "#c23934",
    success: "#2f8f5b",
    warning: "#b7791f",
    info: "#2c7a7b",
    bgGlowA: "#f3f0e2",
    bgGlowB: "#e8e2cf",
  },
  dark: {
    bg: "#1f1f1f",
    surface: "#292929",
    surfaceSoft: "#323232",
    text: "#f2f0e8",
    textMuted: "#beb7a9",
    line: "#4b4b4b",
    brand: "#447187",
    brandStrong: "#355b6d",
    accent: "#d6a45c",
    danger: "#ef6b64",
    success: "#58b780",
    warning: "#d6a45c",
    info: "#69b6b7",
    bgGlowA: "#2d2b26",
    bgGlowB: "#38332a",
  },
  typography: {
    familySans: "var(--font-sans), 'Inter', 'Segoe UI', sans-serif",
    familyMono: "var(--font-mono), 'IBM Plex Mono', Consolas, monospace",
    familyDisplay: "var(--font-sans), 'Inter', 'Segoe UI', sans-serif",
    sizeXs: "0.75rem",
    sizeSm: "0.875rem",
    sizeBase: "1rem",
    sizeLg: "1.125rem",
    sizeXl: "1.25rem",
    size2xl: "1.75rem",
    size3xl: "2.25rem",
    weightRegular: "400",
    weightMedium: "500",
    weightSemibold: "600",
    weightBold: "700",
    weightBlack: "900",
    lineTight: "1.1",
    lineNormal: "1.5",
    lineRelaxed: "1.65",
    trackingTight: "-0.02em",
    trackingNormal: "0",
    trackingWide: "0.02em",
  },
  radius: {
    sm: "8px",
    md: "10px",
    lg: "16px",
    xl: "20px",
    pill: "999px",
  },
  shadow: {
    sm: "0 4px 10px rgba(0, 0, 0, 0.08)",
    md: "0 8px 16px rgba(0, 0, 0, 0.12)",
    lg: "0 20px 40px rgba(0, 0, 0, 0.18)",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "28px",
  },
  motion: {
    fast: "120ms",
    normal: "220ms",
    slow: "360ms",
    easing: "cubic-bezier(0.2, 0.7, 0, 1)",
  },
};
