import { useReducedMotion, type Transition, type Variants } from "motion/react";
import {
  heldItemVariants,
  itemLayoutTransition,
  itemVariants,
  reducedHeldItemVariants,
  reducedItemVariants,
} from "@/ui/pages/portfolio/motion";

export interface ItemMotionProps {
  variants: Variants;
  initial: "hidden";
  animate: "visible";
  exit: "exit";
  /** Lugar en la lista: lo lee la variante `visible` para escalonar. */
  custom: number;
  /** Recolocación con `transform` cuando una fila vecina entra o sale. */
  layout: "position" | false;
  transition: Transition;
}

/**
 * Props de Motion de una fila de lista (ficha de posición o movimiento): entra
 * escalonada, sale con un fundido y se recoloca con `transform`. Con «reducir
 * movimiento» queda solo el fundido: sin subida, sin deslizamiento al salir y
 * sin recolocación animada. Con `holdExit` la fila espera un instante antes de
 * salir, para que se vea la confirmación de su botón de borrar.
 */
export function useItemMotion(index: number, holdExit = false): ItemMotionProps {
  const reduceMotion = useReducedMotion() === true;
  const full = holdExit ? heldItemVariants : itemVariants;
  const reduced = holdExit ? reducedHeldItemVariants : reducedItemVariants;

  return {
    variants: reduceMotion ? reduced : full,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    custom: index,
    layout: reduceMotion ? false : "position",
    transition: itemLayoutTransition,
  };
}
