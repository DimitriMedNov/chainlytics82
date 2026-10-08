/** Rangos que ofrecemos en los gráficos, en días. */
export const RANGES = [
  { days: 1, label: "24 h" },
  { days: 7, label: "7 d" },
  { days: 30, label: "30 d" },
  { days: 90, label: "90 d" },
  { days: 365, label: "1 año" },
] as const;

export type RangeDays = (typeof RANGES)[number]["days"];

export function isRangeDays(value: number): value is RangeDays {
  return RANGES.some((range) => range.days === value);
}

/**
 * Por debajo de dos días la serie llega por horas (la API no acepta
 * `interval=daily` ahí) y se etiqueta con la hora en vez de la fecha.
 */
export function isHourlyRange(days: number): boolean {
  return days <= 1;
}

/** Uno de los rangos ofrecidos, con sus días y su etiqueta. */
export type Range = (typeof RANGES)[number];

/**
 * El siguiente rango más amplio que `days`, o `null` si ya es el mayor.
 * `RANGES` está ordenado de menor a mayor, así que es el primero que lo supera.
 */
export function nextWiderRange(days: RangeDays): Range | null {
  return RANGES.find((range) => range.days > days) ?? null;
}
