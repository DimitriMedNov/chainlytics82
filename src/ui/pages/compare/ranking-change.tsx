import { PriceChange } from "@/ui/shared";
import { useAnimatedNumber } from "@/ui/pages/compare/use-animated-number";

export interface RankingChangeProps {
  /** Variación del periodo, en %. */
  value: number;
}

/**
 * La variación de un puesto: al cambiar de periodo recorre la distancia hasta la cifra nueva.
 *
 * Va en su propio componente A PROPÓSITO: la cuenta cambia de valor en cada fotograma y eso
 * vuelve a pintar a quien la tenga. Si la tuviera la fila (`motion.li` con `layout`), cada
 * pintado haría que Motion midiera la lista y adelantara todas las animaciones en marcha sin
 * esperar al fotograma siguiente; esas animaciones vuelven a pintar la fila, y así en bucle
 * hasta el error de React «Maximum update depth exceeded» (#185). Aquí solo se repinta la cifra.
 */
export function RankingChange({ value }: RankingChangeProps) {
  const shown = useAnimatedNumber(value);
  // `PriceChange` ya pinta la bajada en naranja (aviso), nunca en rojo.
  return <PriceChange value={shown} size="md" className="shrink-0 font-semibold" />;
}
