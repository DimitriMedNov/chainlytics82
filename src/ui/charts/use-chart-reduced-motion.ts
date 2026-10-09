"use client";

import { useReducedMotion } from "motion/react";

/**
 * Añadido por el proyecto: `true` si el sistema pide «reducir movimiento».
 * El catálogo lo consulta por sí mismo (no depende de un `MotionConfig`
 * exterior): con él activo no hay muelles, crecimientos ni barridos; como
 * mucho, un fundido.
 */
export function useChartReducedMotion(): boolean {
  return useReducedMotion() === true;
}
