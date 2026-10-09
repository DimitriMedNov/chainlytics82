'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

import { Slot, type WithAsChild } from '@/ui/animate-ui/primitives/animate/slot';

type ButtonProps = WithAsChild<
  HTMLMotionProps<'button'> & {
    hoverScale?: number;
    tapScale?: number;
  }
>;

function Button({
  hoverScale = 1.05,
  tapScale = 0.95,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : motion.button;
  // Adaptado al proyecto: con «reducir movimiento» el botón no cambia de
  // tamaño al pasar por encima ni al pulsar (Motion solo quitaba la transición,
  // el salto de escala seguía). El hover y el foco siguen viéndose por color.
  const reduceMotion = useReducedMotion() === true;

  return (
    <Component
      whileTap={reduceMotion ? undefined : { scale: tapScale }}
      whileHover={reduceMotion ? undefined : { scale: hoverScale }}
      {...props}
    />
  );
}

export { Button, type ButtonProps };
