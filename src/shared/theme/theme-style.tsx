import { themeTokens, ThemeColors, ThemeMode } from "./theme-config";

function toCssVars(prefix: string, values: Record<string, string>) {
  return Object.entries(values)
    .map(([key, value]) => `  --${prefix}-${key}: ${value};`)
    .join("\n");
}

function colorVars(mode: ThemeMode, colors: ThemeColors) {
  const common = {
    bg: colors.bg,
    surface: colors.surface,
    "surface-soft": colors.surfaceSoft,
    text: colors.text,
    "text-muted": colors.textMuted,
    line: colors.line,
    brand: colors.brand,
    "brand-strong": colors.brandStrong,
    accent: colors.accent,
    danger: colors.danger,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    "bg-glow-a": colors.bgGlowA,
    "bg-glow-b": colors.bgGlowB,
  };

  if (mode === "light") {
    return [
      toCssVars("color", common),
      `  --bg: ${colors.bg};`,
      `  --surface: ${colors.surface};`,
      `  --surface-soft: ${colors.surfaceSoft};`,
      `  --text: ${colors.text};`,
      `  --text-muted: ${colors.textMuted};`,
      `  --line: ${colors.line};`,
      `  --brand: ${colors.brand};`,
      `  --brand-strong: ${colors.brandStrong};`,
      `  --accent: ${colors.accent};`,
      `  --danger: ${colors.danger};`,
      `  --bg-glow-a: ${colors.bgGlowA};`,
      `  --bg-glow-b: ${colors.bgGlowB};`,
    ].join("\n");
  }

  return toCssVars("color", common);
}

function createThemeCss() {
  const typography = {
    "family-sans": themeTokens.typography.familySans,
    "family-mono": themeTokens.typography.familyMono,
    "family-display": themeTokens.typography.familyDisplay,
    "size-xs": themeTokens.typography.sizeXs,
    "size-sm": themeTokens.typography.sizeSm,
    "size-base": themeTokens.typography.sizeBase,
    "size-lg": themeTokens.typography.sizeLg,
    "size-xl": themeTokens.typography.sizeXl,
    "size-2xl": themeTokens.typography.size2xl,
    "size-3xl": themeTokens.typography.size3xl,
    "weight-regular": themeTokens.typography.weightRegular,
    "weight-medium": themeTokens.typography.weightMedium,
    "weight-semibold": themeTokens.typography.weightSemibold,
    "weight-bold": themeTokens.typography.weightBold,
    "weight-black": themeTokens.typography.weightBlack,
    "line-tight": themeTokens.typography.lineTight,
    "line-normal": themeTokens.typography.lineNormal,
    "line-relaxed": themeTokens.typography.lineRelaxed,
    "tracking-tight": themeTokens.typography.trackingTight,
    "tracking-normal": themeTokens.typography.trackingNormal,
    "tracking-wide": themeTokens.typography.trackingWide,
  };

  const radius = {
    sm: themeTokens.radius.sm,
    md: themeTokens.radius.md,
    lg: themeTokens.radius.lg,
    xl: themeTokens.radius.xl,
    pill: themeTokens.radius.pill,
  };

  const shadow = {
    sm: themeTokens.shadow.sm,
    md: themeTokens.shadow.md,
    lg: themeTokens.shadow.lg,
  };

  const spacing = {
    xs: themeTokens.spacing.xs,
    sm: themeTokens.spacing.sm,
    md: themeTokens.spacing.md,
    lg: themeTokens.spacing.lg,
    xl: themeTokens.spacing.xl,
    "2xl": themeTokens.spacing["2xl"],
  };

  const motion = {
    fast: themeTokens.motion.fast,
    normal: themeTokens.motion.normal,
    slow: themeTokens.motion.slow,
    easing: themeTokens.motion.easing,
  };

  return `
:root {
${colorVars("light", themeTokens.light)}
${toCssVars("font", typography)}
${toCssVars("radius", radius)}
${toCssVars("shadow", shadow)}
${toCssVars("space", spacing)}
${toCssVars("motion", motion)}
}

[data-theme="dark"] {
${colorVars("dark", themeTokens.dark)}
  --bg: ${themeTokens.dark.bg};
  --surface: ${themeTokens.dark.surface};
  --surface-soft: ${themeTokens.dark.surfaceSoft};
  --text: ${themeTokens.dark.text};
  --text-muted: ${themeTokens.dark.textMuted};
  --line: ${themeTokens.dark.line};
  --brand: ${themeTokens.dark.brand};
  --brand-strong: ${themeTokens.dark.brandStrong};
  --accent: ${themeTokens.dark.accent};
  --danger: ${themeTokens.dark.danger};
  --bg-glow-a: ${themeTokens.dark.bgGlowA};
  --bg-glow-b: ${themeTokens.dark.bgGlowB};
}
`.trim();
}

export function ThemeStyle() {
  return <style id="theme-tokens" dangerouslySetInnerHTML={{ __html: createThemeCss() }} />;
}
