/**
 * Comprobaciones de la máquina de estados del chat y de la intro del panel.
 * La intro se compara, combinación por combinación, con el ternario de
 * `AnalystPanel.tsx:34-42` copiado al pie de la letra.
 */
import { resolveAccess } from "../../session/access.ts";
import type { AccountServiceStatus } from "../../session/session.ts";
import { canRetry, chatReducer, INITIAL_CHAT, isBusy, isWaitingFirstChunk, type ChatEvent } from "../chat.ts";
import { analystGreeting, analystUserName, canAskAnalyst, resolveAnalystIntro } from "../intro.ts";
import { ANALYST_SUGGESTIONS, isBlankQuestion, toTurns } from "../message.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const run = (events: ChatEvent[], from = INITIAL_CHAT) => events.reduce(chatReducer, from);
const q = { id: "q1", role: "user" as const, content: "hola" };
const asked: ChatEvent = { type: "asked", question: q, answerId: "a1" };

// --- Camino normal ---
const waiting = run([asked]);
check("preguntar → waiting", waiting, { status: "waiting", messages: [q], error: null, answerId: "a1" });
check("waiting enseña «Analizando...»", isWaitingFirstChunk(waiting), true);
const streaming = run([{ type: "chunk", answerId: "a1", acumulado: "Bit" }], waiting);
check("primer trozo → streaming y crea la burbuja", streaming.messages, [q, { id: "a1", role: "assistant", content: "Bit" }]);
check("streaming ya no enseña «Analizando...»", isWaitingFirstChunk(streaming), false);
const more = run([{ type: "chunk", answerId: "a1", acumulado: "Bitcoin" }], streaming);
check("segundo trozo sustituye el contenido, no añade burbuja", more.messages.map((m) => m.content), ["hola", "Bitcoin"]);
const done = run([{ type: "finished", answerId: "a1" }], more);
check("terminar → idle", [done.status, done.answerId, done.messages.length], ["idle", null, 2]);
check("busy solo en waiting y streaming", ["idle", "waiting", "streaming", "error"].map((s) => isBusy(s as never)), [false, true, true, false]);

// --- Error ---
const failed = run([{ type: "failed", answerId: "a1", message: "Demasiadas solicitudes. Intenta en un momento." }], more);
check("fallo → error, quita la respuesta a medias y deja la pregunta", failed, { status: "error", messages: [q], error: "Demasiadas solicitudes. Intenta en un momento.", answerId: null });
check("tras error se puede reintentar", canRetry(failed), true);
const retried = run([{ type: "retried", answerId: "a2" }], failed);
check("reintentar → waiting sin duplicar la pregunta", retried, { status: "waiting", messages: [q], error: null, answerId: "a2" });
const q2 = { id: "q2", role: "user" as const, content: "otra" };
check("tras error también se puede preguntar otra cosa", run([{ type: "asked", question: q2, answerId: "a3" }], failed).messages, [q, q2]);
check("sin error no hay reintento", [canRetry(INITIAL_CHAT), canRetry(done), canRetry(waiting)], [false, false, false]);
check("reintentar fuera de error se ignora", run([{ type: "retried", answerId: "x" }], done) === done, true);

// --- Parar y eventos fuera de sitio ---
const stopped = run([{ type: "stopped" }], more);
check("parar → idle y lo escrito se queda", [stopped.status, stopped.messages.length], ["idle", 2]);
check("parar sin nada en marcha se ignora", run([{ type: "stopped" }]) === INITIAL_CHAT, true);
check("preguntar con respuesta en marcha se ignora", run([asked], waiting) === waiting, true);
check("trozo de una respuesta anterior se ignora", run([{ type: "chunk", answerId: "viejo", acumulado: "x" }], waiting) === waiting, true);
check("trozo tras parar se ignora", run([{ type: "chunk", answerId: "a1", acumulado: "x" }], stopped) === stopped, true);
check("fallo de una respuesta anterior se ignora", run([{ type: "failed", answerId: "viejo", message: "x" }], waiting) === waiting, true);

// --- Mensajes ---
check("sugerencias, textos exactos", ANALYST_SUGGESTIONS, ["¿Cómo está el mercado hoy?", "Analiza Bitcoin vs Ethereum", "¿Qué son los meme coins?", "Explícame el market cap"]);
check("pregunta en blanco", ["", "   ", "\n", " a "].map(isBlankQuestion), [true, true, true, false]);
check("al servidor va rol y contenido, sin id", toTurns(more.messages), [{ role: "user", content: "hola" }, { role: "assistant", content: "Bitcoin" }]);

// --- Intro: igual que AnalystPanel.tsx:34-42 ---
function introAntes(session: boolean, backend: AccountServiceStatus, mensajes: number) {
  const canSignIn = backend === "ready";
  return !session
    ? canSignIn
      ? "signin"
      : backend !== "checking"
        ? "unavailable"
        : null
    : mensajes === 0
      ? "welcome"
      : null;
}
const servicios: AccountServiceStatus[] = ["checking", "ready", "unconfigured", "unreachable"];
for (const service of servicios) {
  for (const hasSession of [false, true]) {
    for (const loading of [false, true]) {
      for (const mensajes of [0, 3]) {
        const access = resolveAccess({ service, hasSession, loading });
        const caso = `${service} / ${hasSession ? "con" : "sin"} sesión / ${loading ? "cargando" : "listo"} / ${mensajes} mensajes`;
        check(`intro · ${caso}`, resolveAnalystIntro(access, mensajes), introAntes(hasSession, service, mensajes));
        check(`formulario · ${caso}`, canAskAnalyst(access), hasSession);
      }
    }
  }
}
check("nombre del saludo", [analystUserName("ana@correo.com"), analystUserName(null), analystUserName(undefined), analystUserName("")], ["ana", undefined, undefined, ""].map((v) => v));
check("saludo", [analystGreeting("ana"), analystGreeting(undefined), analystGreeting("")], ["Hola, ana", "Hola", "Hola"]);
