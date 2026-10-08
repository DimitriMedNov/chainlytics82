import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useScrollReveal } from "@/ui/pages/panel/motion/use-scroll-reveal";
import { Panel } from "@/ui/shared";

/** El `Panel` compartido, sin tocarlo, como componente de Motion (pasa `ref` y `style` a su `<section>`). */
const MotionPanel = motion.create(Panel);

export interface RevealPanelProps {
  /** `id` del título del panel. */
  "aria-labelledby": string;
  "data-slot": string;
  children: ReactNode;
  className?: string;
}

/**
 * `Panel` que entra (fundido + sube unos píxeles) al llegar a él con el scroll.
 * Si ya está en pantalla al cargar, se ve de inmediato y no se anima.
 * Sus partes se siguen usando igual: `Panel.Header`, `Panel.Body`…
 */
export function RevealPanel({ children, ...props }: RevealPanelProps) {
  const { ref, style } = useScrollReveal<HTMLElement>();

  return (
    <MotionPanel ref={ref} style={style} {...props}>
      {children}
    </MotionPanel>
  );
}
