/**
 * Comprobaciones del caso de uso «preguntar al analista» y de sus errores, con
 * un puerto de mentira. Los textos son los de `src/lib/analystStream.ts`.
 */
import type { AnalystMessage } from "../../../domain/analyst/message.ts";
import { AnalystError, emptyAnswerError, failedStatusError, knownStatusError, mustSignOut, toAnalystError } from "../errors.ts";
import type { AnalystStreamPort, AnalystStreamRequest } from "../ports.ts";
import { askAnalyst } from "../useCases.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const conversation: AnalystMessage[] = [
  { id: "1", role: "user", content: "hola" },
  { id: "2", role: "assistant", content: "buenas" },
  { id: "3", role: "user", content: "¿y BTC?" },
];
const pedir = (port: AnalystStreamPort, controller = new AbortController(), onText: (t: string) => void = () => {}) =>
  askAnalyst(port, { accessToken: "tok", conversation, signal: controller.signal, onText });

// --- Mensajes por código ---
check("401", knownStatusError(401)?.message, "Sesión expirada. Inicia sesión nuevamente.");
check("402", knownStatusError(402)?.message, "Créditos de IA agotados. Agrega fondos en tu workspace.");
check("403", knownStatusError(403)?.message, "No tienes permisos para usar la IA.");
check("429", knownStatusError(429)?.message, "Demasiadas solicitudes. Intenta en un momento.");
check("códigos", [401, 402, 403, 429].map((s) => knownStatusError(s)?.code), ["unauthorized", "no-credits", "forbidden", "rate-limited"]);
check("400, 500 y 200 no tienen mensaje propio", [400, 500, 200].map(knownStatusError), [null, null, null]);
check("400 y 500 → genérico", [400, 500].map((s) => failedStatusError(s).message), ["No se pudo obtener respuesta de la IA", "No se pudo obtener respuesta de la IA"]);
check("sin texto", [emptyAnswerError().message, emptyAnswerError().status], ["La IA no devolvió ninguna respuesta. Prueba otra vez.", null]);
check("red caída → genérico", [toAnalystError(new TypeError("Failed to fetch")).message, toAnalystError(new TypeError("x")).code], ["No se pudo obtener respuesta de la IA", "network"]);
check("un AnalystError se respeta", toAnalystError(failedStatusError(500)).status, 500);
check("solo el 401 cierra sesión", [401, 402, 403, 429].map((s) => mustSignOut(knownStatusError(s) as AnalystError)).concat(mustSignOut(failedStatusError(500)), mustSignOut(emptyAnswerError())), [true, false, false, false, false, false]);

// --- Caso de uso ---
let visto: AnalystStreamRequest | null = null;
const trozos: string[] = [];
const bien = await pedir({
  async stream(request) {
    visto = request;
    request.onText("Bit");
    request.onText("Bitcoin");
  },
}, undefined, (t) => trozos.push(t));
const enviado = visto as AnalystStreamRequest | null;
check("éxito → done", bien, { ok: true, value: "done" });
check("envía todo el historial, solo rol y contenido", enviado?.messages, [{ role: "user", content: "hola" }, { role: "assistant", content: "buenas" }, { role: "user", content: "¿y BTC?" }]);
check("pasa la credencial", enviado?.accessToken, "tok");
check("entrega el texto acumulado", trozos, ["Bit", "Bitcoin"]);

const rechazo = await pedir({ stream: async () => { throw knownStatusError(429); } });
check("rechazo del servidor → error con su mensaje", rechazo.ok ? null : [rechazo.error.message, rechazo.error.status], ["Demasiadas solicitudes. Intenta en un momento.", 429]);
const red = await pedir({ stream: async () => { throw new TypeError("Failed to fetch"); } });
check("sin red → mensaje genérico", red.ok ? null : red.error.message, "No se pudo obtener respuesta de la IA");

const cancelado = new AbortController();
const aborto = await pedir({
  async stream() {
    cancelado.abort();
    throw new DOMException("Aborted", "AbortError");
  },
}, cancelado);
check("cancelar no es un error", aborto, { ok: true, value: "aborted" });
const tarde = new AbortController();
const abortoTarde = await pedir({ stream: async () => { tarde.abort(); throw knownStatusError(401); } }, tarde);
check("un fallo tras cancelar tampoco se avisa", abortoTarde, { ok: true, value: "aborted" });
