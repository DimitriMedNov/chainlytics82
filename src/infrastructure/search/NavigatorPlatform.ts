import type { PlatformPort } from "@/application/search/ports";
import { isMacPlatform } from "@/domain/search/shortcut";

/** Plataforma leída de `navigator.platform`. Sin navegador, no es Mac. */
export function createNavigatorPlatform(): PlatformPort {
  return {
    isMac: () => typeof navigator !== "undefined" && isMacPlatform(navigator.platform),
  };
}
