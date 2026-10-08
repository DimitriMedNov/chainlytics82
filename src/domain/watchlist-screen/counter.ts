/**
 * Subtítulo de la cabecera. `count` son las entradas GUARDADAS, no las que se
 * ven con precio.
 */
// Conservado: cuenta también las monedas fuera del top 100, que no se pintan
// (inventario §9, punto 3).
export function followedCountLabel(count: number): string {
  return count === 0
    ? "Aún no sigues ninguna moneda"
    : `Sigues ${count} ${count === 1 ? "moneda" : "monedas"}, con precios en vivo`;
}
