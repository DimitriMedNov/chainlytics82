"use client";

import { useMemo } from "react";
import {
  computeSeriesPathPoints,
  seriesPathFromPoints,
} from "./series-path-utils";

import type { CurveFactory } from "d3-shape";

export interface UseAnimatedSeriesPathOptions {
  renderData: Record<string, unknown>[];
  xAccessor: (datum: Record<string, unknown>) => Date;
  xScale: (value: Date) => number | undefined;
  yScale: (value: number) => number | undefined;
  dataKey: string;
  curve: CurveFactory;
  chartPhase: string;
  durationMs: number;
  innerWidth: number;
  enabled: boolean;
}

/**
 * Trazado de la serie con la escala del fotograma actual.
 *
 * Arreglo del proyecto. El original lanzaba aquí una segunda animación (de
 * los puntos «anteriores» a los nuevos) encima de la transición del dominio
 * Y que ya hace `useAnimatedYDomains`. Tenía dos fallos:
 *  - el punto de partida ya eran los datos nuevos dibujados con la escala
 *    vieja (un efecto lo sobrescribía antes de empezar), así que no había
 *    ningún «morph» real, solo un segundo suavizado que hacía que la línea
 *    fuera por detrás de la rejilla y del eje;
 *  - dependía de `yScale`, que cambia en cada fotograma de la transición, y
 *    la animación se paraba a medias: la línea quedaba congelada con la
 *    escala anterior.
 * Ahora la línea se calcula siempre con el mismo `yScale` que usan la rejilla
 * y el eje en ese fotograma: se mueven a la vez durante la transición y, con
 * «reducir movimiento» (el dominio no se anima), salta directa al final.
 * Se conservan los parámetros y lo que devuelve para no cambiar a quien lo usa.
 */
export function useAnimatedSeriesPath({
  renderData,
  xAccessor,
  xScale,
  yScale,
  dataKey,
  curve,
}: UseAnimatedSeriesPathOptions) {
  const points = useMemo(
    () =>
      computeSeriesPathPoints(renderData, xAccessor, xScale, yScale, dataKey),
    [renderData, xAccessor, xScale, yScale, dataKey]
  );
  const pathD = useMemo(
    () => seriesPathFromPoints(points, curve),
    [points, curve]
  );

  return {
    pathD,
    /** Ya no hay animación propia: la mueve la transición del dominio Y. */
    isPathAnimating: false,
  };
}
