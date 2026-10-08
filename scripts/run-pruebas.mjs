#!/usr/bin/env node
/**
 * Ejecuta todas las pruebas `*.prueba.ts` de `src/` con el TypeScript nativo
 * de Node (sin runner). Sale con código 1 si alguna comprobación falla.
 *
 *   node scripts/run-pruebas.mjs
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function findPruebas(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return findPruebas(path);
    return entry.name.endsWith(".prueba.ts") ? [path] : [];
  });
}

let total = 0;
let fallos = 0;
const rotos = [];

for (const file of findPruebas(join(root, "src")).sort()) {
  const run = spawnSync(
    process.execPath,
    ["--experimental-strip-types", "--disable-warning=ExperimentalWarning", file],
    { encoding: "utf8" },
  );
  const lines = run.stdout.split("\n");
  const ok = lines.filter((line) => line.startsWith("✓")).length;
  const ko = lines.filter((line) => line.startsWith("✗"));
  total += ok + ko.length;
  fallos += ko.length;

  const nombre = relative(root, file);
  if (run.status !== 0 || ko.length > 0) {
    rotos.push(nombre);
    console.log(`✗ ${nombre}: ${ok} en verde, ${ko.length} fallos`);
    ko.forEach((line) => console.log(`    ${line}`));
    if (run.stderr.trim() !== "") console.log(run.stderr.trim());
  } else {
    console.log(`✓ ${nombre}: ${ok} comprobaciones`);
  }
}

console.log(`\n${total} comprobaciones, ${fallos} fallos, ${rotos.length} archivos con problemas.`);
if (rotos.length > 0) process.exit(1);
