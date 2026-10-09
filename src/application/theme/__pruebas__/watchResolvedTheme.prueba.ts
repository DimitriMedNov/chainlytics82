/**
 * Comprobaciones de "seguir el tema que se ve": con "system" la clase sigue al
 * sistema operativo en vivo; con un tema fijo deja de escucharlo; al apagar no
 * queda ninguna suscripción.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { Theme } from "../../../domain/theme/theme.ts";
import type { SystemThemePort, ThemePreferencePort } from "../ports.ts";
import { createThemeController } from "../themeController.ts";
import { watchResolvedTheme } from "../watchResolvedTheme.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

/** Sistema operativo de mentira: se le cambia el tema a mano. */
function sistemaFalso(oscuro: boolean) {
  const oyentes = new Set<() => void>();
  const port: SystemThemePort = {
    isDark: () => oscuro,
    subscribe(listener) {
      oyentes.add(listener);
      return () => void oyentes.delete(listener);
    },
  };
  return {
    port,
    oyentes: () => oyentes.size,
    cambiar(aOscuro: boolean) {
      oscuro = aOscuro;
      [...oyentes].forEach((listener) => listener());
    },
  };
}

function montar(inicial: Theme, sistemaOscuro: boolean) {
  const preferencia: ThemePreferencePort = { load: () => inicial, save: () => {} };
  const controller = createThemeController(preferencia);
  const sistema = sistemaFalso(sistemaOscuro);
  // Hace de `<html>`: guarda la última clase puesta.
  const html = { clase: "", veces: 0 };
  const apagar = watchResolvedTheme(controller, sistema.port, (resuelto) => {
    html.clase = resuelto;
    html.veces++;
  });
  return { controller, sistema, html, apagar };
}

// Modo "system": sigue al sistema operativo sin recargar.
{
  const { sistema, html, apagar } = montar("system", true);
  check("system + SO oscuro: arranca en dark", html.clase, "dark");
  check("system: escucha al SO", sistema.oyentes(), 1);
  sistema.cambiar(false);
  check("system: SO pasa a claro → light", html.clase, "light");
  sistema.cambiar(true);
  check("system: SO vuelve a oscuro → dark", html.clase, "dark");
  apagar();
  check("al apagar no queda nadie escuchando al SO", sistema.oyentes(), 0);
  sistema.cambiar(false);
  check("apagado: el SO ya no cambia la clase", html.clase, "dark");
}

// De "system" a un modo fijo: deja de seguir.
{
  const { controller, sistema, html, apagar } = montar("system", false);
  check("system + SO claro: arranca en light", html.clase, "light");
  controller.setTheme("dark");
  check("pasa a oscuro fijo → dark", html.clase, "dark");
  check("modo fijo: deja de escuchar al SO", sistema.oyentes(), 0);
  const veces = html.veces;
  sistema.cambiar(true);
  sistema.cambiar(false);
  check("modo fijo: el SO no cambia la clase", html.clase, "dark");
  check("modo fijo: el SO no provoca ningún aviso", html.veces, veces);
  controller.setTheme("light");
  check("pasa a claro fijo → light", html.clase, "light");
  check("claro fijo: sigue sin escuchar al SO", sistema.oyentes(), 0);
  apagar();
}

// De un modo fijo a "system": empieza a seguir, con una sola suscripción.
{
  const { controller, sistema, html, apagar } = montar("dark", false);
  check("oscuro fijo + SO claro: arranca en dark", html.clase, "dark");
  check("oscuro fijo: no escucha al SO", sistema.oyentes(), 0);
  controller.setTheme("system");
  check("pasa a system con SO claro → light", html.clase, "light");
  controller.setTheme("system");
  check("elegir system dos veces: una sola suscripción", sistema.oyentes(), 1);
  sistema.cambiar(true);
  check("system: SO pasa a oscuro → dark", html.clase, "dark");
  apagar();
  check("al apagar no queda nadie escuchando al SO", sistema.oyentes(), 0);
  controller.setTheme("light");
  check("apagado: cambiar de tema ya no cambia la clase", html.clase, "dark");
}
