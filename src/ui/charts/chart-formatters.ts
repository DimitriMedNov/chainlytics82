/**
 * Adaptado al proyecto: el original escribía las fechas en inglés (`en-US`).
 * Por defecto van en español de España y se pueden cambiar por gráfica
 * (`formatDate` en `XAxis` / `ChartTooltip`) o para todo un árbol
 * (`ChartConfigProvider value={{ formatDate, formatTooltipDate }}`).
 */
export const CHART_DATE_LOCALE = "es-ES";

/** Escribe una fecha del eje, de la píldora o del título del tooltip. */
export type ChartDateFormatter = (date: Date) => string;

export const shortDateFmt = new Intl.DateTimeFormat(CHART_DATE_LOCALE, {
  month: "short",
  day: "numeric",
});

export const weekdayDateFmt = new Intl.DateTimeFormat(CHART_DATE_LOCALE, {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export const hmsTimeFmt = new Intl.DateTimeFormat(CHART_DATE_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Por defecto del eje X y de la píldora: «8 oct». */
export const formatShortDate: ChartDateFormatter = (date) =>
  shortDateFmt.format(date);

/** Por defecto del título del tooltip: «jue, 8 oct». */
export const formatWeekdayDate: ChartDateFormatter = (date) =>
  weekdayDateFmt.format(date);

// `Intl.NumberFormat.prototype.format` is a bound getter — safe to extract.
// Adaptado al proyecto: el original usaba `en-US` («1,234»); ahora «1234» / «12.345».
export const intFmt = new Intl.NumberFormat("es-ES").format;
