import type { BaseDeps } from "@/app/base";

/**
 * Acceso (/auth): lo propio de la pantalla. Iniciar sesión, registrarse y su validación ya están en `session`.
 *
 * Módulo aún vacío: lo rellena el agente de arquitectura de esta pantalla,
 * junto con sus carpetas `src/{domain,application,infrastructure,hooks}/auth-screen/`.
 * `base` trae lo compartido (`market`, `session`, `watchlist`, `portfolio`,
 * `sync`, `theme`) para construir encima. Lo que devuelva esta función llega
 * a los hooks con `useDeps().authScreen`.
 */
export function createAuthScreenModule(_base: BaseDeps) {
  return {};
}
