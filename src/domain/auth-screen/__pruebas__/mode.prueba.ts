/**
 * Comprobaciones del modo de la pantalla de acceso. Para las 16 combinaciones
 * de servicio × sesión × cargando se compara lo que decide
 * `resolveAuthScreenMode` con lo que hacía `pages/Auth.tsx`, copiado aquí al
 * pie de la letra. Se ejecutan con `node --experimental-strip-types`.
 */
import { resolveAccess } from "../../session/access.ts";
import type { AccountServiceStatus } from "../../session/session.ts";
import { AUTH_TABS, DEFAULT_AUTH_TAB, isAuthTab, NO_FIELD_ERRORS } from "../form.ts";
import { authRedirectTarget, resolveAuthScreenMode, type AuthScreenMode } from "../mode.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

/** Auth.tsx:27-44 (el efecto redirige en cuanto hay sesión). */
function authAntes(session: boolean, loading: boolean, backend: AccountServiceStatus): string {
  if (session) return "redirige:/";
  if (loading || backend === "checking") return "en-blanco";
  if (backend !== "ready") return `sin-servicio:${backend}`;
  return "formulario";
}

function comoTexto(mode: AuthScreenMode): string {
  if (mode.kind === "signed-in") return `redirige:${mode.redirectTo}`;
  if (mode.kind === "checking") return "en-blanco";
  if (mode.kind === "unavailable") return `sin-servicio:${mode.reason}`;
  return "formulario";
}

const SERVICIOS: AccountServiceStatus[] = ["checking", "ready", "unconfigured", "unreachable"];

for (const service of SERVICIOS) {
  for (const hasSession of [false, true]) {
    for (const loading of [false, true]) {
      const mode = resolveAuthScreenMode(resolveAccess({ service, hasSession, loading }));
      const caso = `servicio=${service} sesión=${hasSession} cargando=${loading}`;
      check(`modo · ${caso}`, comoTexto(mode), authAntes(hasSession, loading, service));
      check(`redirección · ${caso}`, authRedirectTarget(mode), hasSession ? "/" : null);
    }
  }
}

check("pestaña inicial", DEFAULT_AUTH_TAB, "signin");
check("orden de pestañas", AUTH_TABS, ["signin", "signup"]);
check("isAuthTab signin", isAuthTab("signin"), true);
check("isAuthTab signup", isAuthTab("signup"), true);
check("isAuthTab otro", isAuthTab("reset"), false);
check("sin errores de campo", NO_FIELD_ERRORS, { email: null, password: null });
