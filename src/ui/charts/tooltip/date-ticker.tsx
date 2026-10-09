"use client";

import { motion, useSpring } from "motion/react";
import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useChartReducedMotion } from "../use-chart-reduced-motion";

const TICKER_ITEM_HEIGHT = 24;
/** Full scroll stacks are skipped above this count — single label + instant updates. */
const COMPACT_TICKER_THRESHOLD = 60;
const TICKER_SPRING = { stiffness: 400, damping: 35 };

/**
 * Adaptado al proyecto: la píldora usa los tokens (texto invertido sobre
 * `foreground`), el original llevaba `bg-zinc-900` / `dark:bg-zinc-100`.
 */
const PILL_CLASS =
  "overflow-hidden rounded-full bg-foreground px-4 py-1 text-background shadow-overlay";

export interface DateTickerProps {
  currentIndex: number;
  /**
   * Etiquetas ya escritas, una por punto. Las da la gráfica con el formato de
   * fecha configurado (`ChartConfigProvider` o `formatDate` del tooltip).
   */
  labels: string[];
  visible: boolean;
  /** Añadido por el proyecto: clases extra de la píldora. */
  className?: string;
}

const DateTickerCompact = memo(function DateTickerCompact({
  currentIndex,
  labels,
  className,
}: Omit<DateTickerProps, "visible">) {
  const label = labels[currentIndex] ?? labels[0] ?? "";

  return (
    <div className={cn(PILL_CLASS, className)}>
      <div className="flex h-6 items-center justify-center">
        <span className="whitespace-nowrap font-medium text-sm">{label}</span>
      </div>
    </div>
  );
});

interface TickerSegment {
  text: string;
  key: string;
  startIndex: number;
}

/** Un tramo por cada racha de etiquetas seguidas con el mismo texto. */
function buildSegments(texts: string[]): TickerSegment[] {
  const segments: TickerSegment[] = [];
  texts.forEach((text, index) => {
    if (segments.at(-1)?.text !== text) {
      segments.push({ text, key: `${text}::${index}`, startIndex: index });
    }
  });
  return segments;
}

function segmentIndexFor(segments: TickerSegment[], index: number): number {
  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i];
    if (segment && segment.startIndex <= index) {
      return i;
    }
  }
  return 0;
}

function TickerStack({
  segments,
  activeIndex,
}: {
  segments: TickerSegment[];
  activeIndex: number;
}) {
  const y = useSpring(-activeIndex * TICKER_ITEM_HEIGHT, TICKER_SPRING);
  y.set(-activeIndex * TICKER_ITEM_HEIGHT);

  return (
    <div className="relative h-6 overflow-hidden">
      <motion.div className="flex flex-col" style={{ y }}>
        {segments.map((segment) => (
          <div
            className="flex h-6 shrink-0 items-center justify-center"
            key={segment.key}
          >
            <span className="whitespace-nowrap font-medium text-sm">
              {segment.text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Dos columnas que ruedan: la primera palabra de la etiqueta y el resto.
 * Adaptado al proyecto: el original daba por hecho el orden inglés
 * («Oct 8»: mes y día). Aquí cada columna se agrupa por rachas, así que
 * vale igual para «8 oct» (día y mes) o para cualquier otro formato.
 */
const DateTickerInner = memo(function DateTickerInner({
  currentIndex,
  labels,
  className,
}: Omit<DateTickerProps, "visible">) {
  const { leadSegments, tailSegments, hasTail } = useMemo(() => {
    const leads: string[] = [];
    const tails: string[] = [];
    for (const label of labels) {
      const cut = label.indexOf(" ");
      leads.push(cut === -1 ? label : label.slice(0, cut));
      tails.push(cut === -1 ? "" : label.slice(cut + 1));
    }
    return {
      leadSegments: buildSegments(leads),
      tailSegments: buildSegments(tails),
      hasTail: tails.some((tail) => tail.length > 0),
    };
  }, [labels]);

  const safeIndex =
    currentIndex >= 0 && currentIndex < labels.length ? currentIndex : 0;

  return (
    <div className={cn(PILL_CLASS, className)}>
      <div className="relative h-6 overflow-hidden">
        <div className="flex items-center justify-center gap-1">
          <TickerStack
            activeIndex={segmentIndexFor(leadSegments, safeIndex)}
            segments={leadSegments}
          />
          {hasTail ? (
            <TickerStack
              activeIndex={segmentIndexFor(tailSegments, safeIndex)}
              segments={tailSegments}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
});

export function DateTicker({
  currentIndex,
  labels,
  visible,
  className,
}: DateTickerProps) {
  // Con «reducir movimiento» no rueda: una sola etiqueta que cambia al instante.
  const reduceMotion = useChartReducedMotion();

  if (!visible || labels.length === 0) {
    return null;
  }

  if (reduceMotion || labels.length > COMPACT_TICKER_THRESHOLD) {
    return (
      <DateTickerCompact
        className={className}
        currentIndex={currentIndex}
        labels={labels}
      />
    );
  }

  return (
    <DateTickerInner
      className={className}
      currentIndex={currentIndex}
      labels={labels}
    />
  );
}

DateTicker.displayName = "DateTicker";

export default DateTicker;
