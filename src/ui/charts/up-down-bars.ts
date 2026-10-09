/**
 * Añadido por el proyecto (no viene de Bklit): adaptador «sube / baja» para la
 * gráfica de barras.
 *
 * Bklit pinta un solo color por serie y su eje arranca siempre en cero (no
 * dibuja valores negativos). Por eso un valor con signo va en DOS series
 * apiladas, `up` y `down`, con el TAMAÑO del valor; el sentido lo dan el color
 * de cada serie, la flecha y el signo escrito al lado (`BarEndLabels`). `up`
 * vale 0 en las que bajan y `down` solo existe en las que bajan: así la barra
 * nunca sale con ancho negativo.
 *
 * No lleva textos ni formato de ninguna pantalla: cada pantalla escribe los
 * suyos y los añade a la fila.
 *
 * ```tsx
 * const rows = toUpDownRows(bars, (bar) => bar.change24h, (bar) => ({
 *   id: bar.id, symbol: bar.symbol, name: bar.name, text: formatPercent(bar.change24h),
 * }));
 * <BarChart data={rows} xDataKey="id" orientation="horizontal" stacked>
 *   <Bar dataKey={UP_KEY} fill="hsl(var(--success))" />
 *   <Bar dataKey={DOWN_KEY} fill="hsl(var(--warning))" />
 * </BarChart>
 * ```
 */
export const UP_KEY = "up";
export const DOWN_KEY = "down";

export interface UpDownParts {
  /** Tamaño del valor si sube; 0 si baja. */
  up: number;
  /** Tamaño del valor si baja; no existe si sube. */
  down?: number;
}

/**
 * Fila lista para `BarChart`: los campos de la pantalla más `up` / `down`.
 * Si declaras los campos con `interface`, añádele `[key: string]: unknown`
 * (o usa `type`) para que `BarChart` la acepte como registro.
 */
export type UpDownRow<Fields extends object> = Fields & UpDownParts;

/**
 * Parte un valor con signo en `up` / `down`.
 * `rising` manda si se pasa (p. ej. cuando el dominio decide que 0 cuenta como
 * subida); si no, sube cuando el valor es mayor o igual que cero.
 */
export function splitUpDown(value: number, rising: boolean = value >= 0): UpDownParts {
  const size = Math.abs(value);
  return rising ? { up: size } : { up: 0, down: size };
}

/**
 * Convierte una lista en filas de barras «sube / baja».
 * @param getValue valor con signo de cada elemento.
 * @param getFields campos propios de la pantalla (id, textos ya escritos…).
 * @param isRising opcional: quién sube, si no basta con el signo.
 */
export function toUpDownRows<Item, Fields extends object>(
  items: readonly Item[],
  getValue: (item: Item) => number,
  getFields: (item: Item) => Fields,
  isRising?: (item: Item) => boolean,
): UpDownRow<Fields>[] {
  return items.map((item) => ({
    ...getFields(item),
    ...splitUpDown(getValue(item), isRising?.(item)),
  }));
}

/**
 * Texto alternativo de la gráfica: el título y el valor de cada fila, escritos.
 * `describeRow` devuelve la frase de una fila («Bitcoin +2.45 %»).
 */
export function describeBarRows<Row>(
  title: string,
  rows: readonly Row[],
  describeRow: (row: Row) => string,
): string {
  return `${title}: ${rows.map(describeRow).join("; ")}.`;
}
