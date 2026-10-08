/**
 * Comprobaciones del parser SSE del analista con flujos simulados (no se
 * llama al servicio real). Se ejecutan con `node --experimental-strip-types`.
 */
import { createSseTextParser, deltaDe, readSseText } from "../sseText.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const data = (content: string) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n`;

/** Pasa los trozos por el parser y devuelve lo que vio `onText`, el texto final y si cerró. */
function parsear(trozos: string[]) {
  const vistos: string[] = [];
  const parser = createSseTextParser((t) => vistos.push(t));
  let cerrado = false;
  for (const trozo of trozos) {
    if (parser.feed(trozo)) {
      cerrado = true;
      break;
    }
  }
  return { vistos, texto: parser.text(), cerrado };
}

// --- deltaDe ---
check("delta con texto", deltaDe('{"choices":[{"delta":{"content":"hola"}}]}'), "hola");
check("delta sin content (primer evento con el rol)", deltaDe('{"choices":[{"delta":{"role":"assistant"}}]}'), null);
check("content que no es texto", deltaDe('{"choices":[{"delta":{"content":null}}]}'), null);
check("sin choices / choices vacío / no es objeto", [deltaDe('{"id":"x"}'), deltaDe('{"choices":[]}'), deltaDe('"texto"'), deltaDe("null")], [null, null, null, null]);

// --- Flujo normal ---
check("dos eventos y [DONE]", parsear([data("Hola"), data(" mundo"), "data: [DONE]\n"]), { vistos: ["Hola", "Hola mundo"], texto: "Hola mundo", cerrado: true });
check("varios eventos en el mismo trozo", parsear([data("a") + "\n" + data("b") + "\ndata: [DONE]\n\n"]), { vistos: ["a", "ab"], texto: "ab", cerrado: true });
check("lo que llega después de [DONE] no se lee", parsear(["data: [DONE]\n" + data("tarde")]), { vistos: [], texto: "", cerrado: true });
check("sin [DONE] no cierra", parsear([data("a")]).cerrado, false);

// --- Líneas partidas ---
const linea = data("Bitcoin");
check("trozo partido a mitad del JSON", parsear([linea.slice(0, 25), linea.slice(25)]), { vistos: ["Bitcoin"], texto: "Bitcoin", cerrado: false });
check("partido dentro del prefijo «data: »", parsear([linea.slice(0, 3), linea.slice(3)]).texto, "Bitcoin");
check("partido justo antes del salto de línea", parsear([linea.slice(0, -1), "\n"]).vistos, ["Bitcoin"]);
check("carácter a carácter", parsear([...(data("¿Qué?") + data(" Sí") + "data: [DONE]\n")]), { vistos: ["¿Qué?", "¿Qué? Sí"], texto: "¿Qué? Sí", cerrado: true });
check("línea sin terminar no se procesa todavía", parsear([linea.slice(0, -1)]).vistos, []);
check("[DONE] partido en dos", parsear(["data: [DO", "NE]\n"]).cerrado, true);

// --- Ruido ---
check("líneas vacías entre eventos", parsear(["\n\n" + data("a") + "\n\n\n" + data("b")]).texto, "ab");
check("finales de línea \\r\\n", parsear([data("a").replace("\n", "\r\n"), "data: [DONE]\r\n"]), { vistos: ["a"], texto: "a", cerrado: true });
check("comentarios y otros campos SSE se saltan", parsear([": keep-alive\nevent: message\nid: 7\n" + data("a")]).texto, "a");
check("«data:» sin espacio no cuenta", parsear(['data:{"choices":[{"delta":{"content":"x"}}]}\n']).texto, "");
check("content vacío no avisa", parsear([data(""), data("a")]).vistos, ["a"]);

// --- JSON inválido ---
check("JSON cortado por un salto de línea se completa con el siguiente trozo", parsear(['data: {"choices":[{"delta":\n', data("z")]).vistos, []);
// Conservado: una línea `data:` con JSON que nunca llega a ser válido se
// devuelve al buffer en cada trozo y tapa lo que venga detrás.
check("JSON inválido tapa lo que llega después (conducta heredada)", parsear(["data: {roto\n", data("a"), data("b")]), { vistos: [], texto: "", cerrado: false });

// --- Lectura del cuerpo ---
function cuerpo(partes: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      partes.forEach((parte) => controller.enqueue(parte));
      controller.close();
    },
  });
}
const bytes = new TextEncoder().encode(data("¿Sube €?") + data(" Sí") + "data: [DONE]\n");
const vistos: string[] = [];
const cortes = [7, 30, 31, 40]; // el 31 cae en mitad de los 3 bytes de «€»
const partes = [0, ...cortes].map((inicio, i) => bytes.slice(inicio, cortes[i] ?? bytes.length));
check("cuerpo en trozos de bytes, con un carácter partido", await readSseText(cuerpo(partes), (t) => vistos.push(t)), "¿Sube €? Sí");
check("avisa con el acumulado", vistos, ["¿Sube €?", "¿Sube €? Sí"]);
check("cuerpo que se cierra sin [DONE]", await readSseText(cuerpo([new TextEncoder().encode(data("a"))]), () => {}), "a");
check("cuerpo sin texto → cadena vacía", await readSseText(cuerpo([new TextEncoder().encode("data: [DONE]\n")]), () => {}), "");
check("cuerpo vacío → cadena vacía", await readSseText(cuerpo([]), () => {}), "");
