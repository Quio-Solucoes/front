import logoBoaVistaBranca from "@/app/image/logo-boa-vista_branca.png";
import logoBoaVistaBrancaMin from "@/app/image/logo-boa-vista_branca_min.png";
import logoBoaVistaPreta from "@/app/image/logo-boa-vista_preto.png";
import logoBoaVistaPretaMin from "@/app/image/logo-boa-vista_preto_min.png";
import { ThemeMode } from "./theme-config";

export const brandConfig = {
  appName: "Boa Vista",
  logoByTheme: {
    light: logoBoaVistaPreta,
    dark: logoBoaVistaBranca,
  },
  logoMinByTheme: {
    light: logoBoaVistaPretaMin,
    dark: logoBoaVistaBrancaMin,
  },
} as const;

export function getBrandLogo(theme: ThemeMode) {
  return brandConfig.logoByTheme[theme];
}

export function getBrandLogoMin(theme: ThemeMode) {
  return brandConfig.logoMinByTheme[theme];
}
