/**
 * Comprobaciones del estado de acceso. Para las 16 combinaciones de
 * servicio × sesión × cargando se compara lo que decide la máquina con la
 * decisión que tomaba cada sitio de la interfaz anterior, copiada aquí al pie
 * de la letra. Se ejecutan con `node --experimental-strip-types`.
 */
import { isAccessPending, resolveAccess, type AccessState } from "../access.ts";
import type { AccountServiceStatus } from "../session.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

// --- Decisiones de la interfaz anterior, tal cual ---

/** Navbar.tsx:78-87 */
function navbarAntes(session: boolean, backend: AccountServiceStatus): string {
  return session ? "cuenta" : backend === "ready" ? "iniciar-sesion" : "nada";
}
/** Auth.tsx:27-44 (el efecto redirige en cuanto hay sesión) */
function authAntes(session: boolean, loading: boolean, backend: AccountServiceStatus): string {
  if (session) return "redirige";
  if (loading || backend === "checking") return "en-blanco";
  if (backend !== "ready") return `sin-servicio:${backend}`;
  return "formulario";
}
/** StorageBadge.tsx:12-33 */
function badgeAntes(session: boolean, backend: AccountServiceStatus): string {
  if (session) return "en-tu-cuenta";
  return backend === "ready" ? "local+enlace" : "local";
}
/** AnalystPanel.tsx:34-42, sin mensajes */
function analistaAntes(session: boolean, backend: AccountServiceStatus): string {
  return !session
    ? backend === "ready"
      ? "signin"
      : backend !== "checking"
        ? "unavailable"
        : "nada"
    : "welcome";
}

// --- Las mismas decisiones, leídas del estado de acceso ---

function navbarAhora(a: AccessState): string {
  if (a.kind === "signed-in") return "cuenta";
  return a.kind === "signed-out" ? "iniciar-sesion" : "nada";
}
function authAhora(a: AccessState): string {
  if (a.kind === "signed-in") return "redirige";
  if (isAccessPending(a)) return "en-blanco";
  if (a.kind === "unavailable") return `sin-servicio:${a.reason}`;
  return "formulario";
}
function badgeAhora(a: AccessState): string {
  if (a.kind === "signed-in") return "en-tu-cuenta";
  return a.canSignIn ? "local+enlace" : "local";
}
function analistaAhora(a: AccessState): string {
  switch (a.kind) {
    case "signed-in": return "welcome";
    case "signed-out": return "signin";
    case "unavailable": return "unavailable";
    case "checking": return "nada";
  }
}

const servicios: AccountServiceStatus[] = ["checking", "ready", "unconfigured", "unreachable"];

for (const service of servicios) {
  for (const hasSession of [false, true]) {
    for (const loading of [false, true]) {
      const caso = `${service} / ${hasSession ? "con" : "sin"} sesión / ${loading ? "cargando" : "listo"}`;
      const access = resolveAccess({ service, hasSession, loading });
      check(`barra · ${caso}`, navbarAhora(access), navbarAntes(hasSession, service));
      check(`acceso · ${caso}`, authAhora(access), authAntes(hasSession, loading, service));
      check(`aviso de guardado · ${caso}`, badgeAhora(access), badgeAntes(hasSession, service));
      check(`analista · ${caso}`, analistaAhora(access), analistaAntes(hasSession, service));
      check(`canSignIn · ${caso}`, access.canSignIn, service === "ready");
    }
  }
}

// Casos sueltos, para que se lea qué estado sale
check("con sesión gana aunque el servicio esté caído", resolveAccess({ service: "unreachable", hasSession: true, loading: false }).kind, "signed-in");
check("sin servicio lleva el motivo", resolveAccess({ service: "unconfigured", hasSession: false, loading: false }), { kind: "unavailable", canSignIn: false, reason: "unconfigured", settled: true });
check("sin sesión y listo", resolveAccess({ service: "ready", hasSession: false, loading: false }), { kind: "signed-out", canSignIn: true, settled: true });
