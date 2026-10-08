/**
 * Comprobaciones de lo puro de la pantalla de acceso: validación por campo,
 * resultado del envío y textos, comparados con `pages/Auth.tsx` y
 * `components/states/BackendUnavailable.tsx`. Se ejecutan con
 * `node --experimental-strip-types`.
 */
import { err, ok } from "../../../domain/shared/result.ts";
import { parseCredentials } from "../../session/credentials.ts";
import { validateAuthFields } from "../fieldErrors.ts";
import {
  accountServiceNotice,
  AUTH_CARD_TEXT,
  AUTH_FIELD_TEXT,
  AUTH_TAB_TEXT,
} from "../presentation/texts.ts";
import { authSubmitOutcome } from "../submitOutcome.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

// --- Validación por campo ---
const CASOS: Array<[string, string]> = [
  ["ana@correo.com", "secreta1"],
  ["  ana@correo.com  ", "123456"],
  ["no-es-correo", "secreta1"],
  ["ana@correo.com", "12345"],
  ["no-es-correo", "12345"],
  ["", ""],
  [`${"a".repeat(250)}@correo.com`, "secreta1"],
  ["ana@correo.com", "x".repeat(73)],
];

check("campos válidos", validateAuthFields("ana@correo.com", "secreta1"), {
  email: null,
  password: null,
});
check("correo con espacios vale", validateAuthFields("  ana@correo.com ", "secreta1").email, null);
check("correo mal", validateAuthFields("no-es-correo", "secreta1"), {
  email: "Email inválido",
  password: null,
});
check("contraseña corta", validateAuthFields("ana@correo.com", "12345"), {
  email: null,
  password: "Mínimo 6 caracteres",
});
check("los dos mal", validateAuthFields("x", "1"), {
  email: "Email inválido",
  password: "Mínimo 6 caracteres",
});

// El primer error por campo (correo, luego contraseña) es el mismo mensaje que
// enseñaba el aviso de la pantalla anterior (`issues[0].message`).
for (const [email, password] of CASOS) {
  const porCampo = validateAuthFields(email, password);
  const parsed = parseCredentials(email, password);
  check(
    `primer error = aviso anterior · "${email.slice(0, 20)}" / ${password.length} caracteres`,
    porCampo.email ?? porCampo.password,
    parsed.ok ? null : parsed.error,
  );
}

// --- Resultado del envío ---
check("entrar bien", authSubmitOutcome("signin", ok(undefined)), {
  notice: { kind: "success", text: "¡Bienvenido!" },
  navigateTo: "/",
});
check("registrarse bien", authSubmitOutcome("signup", ok(undefined)), {
  notice: { kind: "success", text: "Cuenta creada. Revisa tu correo para confirmarla." },
  navigateTo: null,
});
check("entrar mal", authSubmitOutcome("signin", err("Credenciales incorrectas")), {
  notice: { kind: "error", text: "Credenciales incorrectas" },
  navigateTo: null,
});
check("registrarse mal", authSubmitOutcome("signup", err("Ese email ya está registrado")), {
  notice: { kind: "error", text: "Ese email ya está registrado" },
  navigateTo: null,
});
check("error no previsto, tal cual", authSubmitOutcome("signin", err("Email not confirmed")), {
  notice: { kind: "error", text: "Email not confirmed" },
  navigateTo: null,
});

// --- Textos ---
check("tarjeta", AUTH_CARD_TEXT, {
  title: "Accede a Chainlytics",
  description: "Inicia sesión para usar el analista de criptomonedas con IA",
});
check("pestañas", AUTH_TAB_TEXT, {
  signin: { label: "Iniciar sesión", submit: "Entrar" },
  signup: { label: "Crear cuenta", submit: "Crear cuenta" },
});
check("campos", AUTH_FIELD_TEXT, {
  email: { label: "Email", inputType: "email" },
  password: { label: "Contraseña", inputType: "password" },
});

const sinConfigurar = accountServiceNotice("unconfigured");
check("sin configurar · icono", sinConfigurar.icon, "settings");
check("sin configurar · título", sinConfigurar.title, "El servicio de cuentas no está configurado");
check(
  "sin configurar · descripción",
  sinConfigurar.description,
  "Faltan las variables de Supabase en el archivo .env.",
);
check(
  "sin configurar · comando",
  sinConfigurar.command,
  "cp .env.example .env\n# y rellena los tres valores",
);

const noResponde = accountServiceNotice("unreachable");
check("no responde · icono", noResponde.icon, "cloud-off");
check("no responde · título", noResponde.title, "El servicio de cuentas no responde");
check(
  "no responde · descripción",
  noResponde.description,
  "El proyecto de Supabase configurado no contesta. Puede estar pausado, borrado, o puede que no haya conexión.",
);
check("no responde · sin comando", noResponde.command, null);

const { before, what, after } = noResponde.meanwhile;
check(
  "mientras tanto, frase entera",
  `${before}${what}${after}`,
  "Mientras tanto, no puedes iniciar sesión ni usar el analista con IA. El resto de la app funciona con normalidad: los precios no necesitan cuenta.",
);
check("mientras tanto, otro motivo", accountServiceNotice("unreachable", "x").meanwhile.what, "x");
