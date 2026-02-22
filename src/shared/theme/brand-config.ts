import logoBoaVistaBranca from "@/app/image/logo-boa-vista_branca.png";
import logoBoaVistaPreta from "@/app/image/logo-boa-vista_preto.png";
import { ThemeMode } from "./theme-config";

export const brandConfig = {
  appName: "Boa Vista",
  logoByTheme: {
    light: logoBoaVistaPreta,
    dark: logoBoaVistaBranca,
  },
} as const;

export function getBrandLogo(theme: ThemeMode) {
  return brandConfig.logoByTheme[theme];
}
