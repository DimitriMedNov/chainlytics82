'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { motion, useReducedMotion } from 'motion/react';

import { getStrictContext } from '@/lib/get-strict-context';

type ProgressContextType = {
  value: number;
};

const [ProgressProvider, useProgress] =
  getStrictContext<ProgressContextType>('ProgressContext');

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;

function Progress(props: ProgressProps) {
  return (
    <ProgressProvider value={{ value: props.value ?? 0 }}>
      <ProgressPrimitive.Root data-slot="progress" {...props} />
    </ProgressProvider>
  );
}

const MotionProgressIndicator = motion.create(ProgressPrimitive.Indicator);

type ProgressIndicatorProps = React.ComponentProps<
  typeof MotionProgressIndicator
>;

function ProgressIndicator({
  transition = { type: 'spring', stiffness: 100, damping: 30 },
  initial,
  ...props
}: ProgressIndicatorProps) {
  const { value } = useProgress();
  // Adaptado al proyecto: con «reducir movimiento» el relleno se pinta ya en
  // su valor desde el primer fotograma. `initial={false}` hace que Motion
  // escriba el `animate` en el primer render, así que se ignora el `initial`
  // que pase quien lo usa (una barra vacía que luego saltaría a su sitio).
  const reduceMotion = useReducedMotion();

  return (
    <MotionProgressIndicator
      data-slot="progress-indicator"
      animate={{ x: `-${100 - (value || 0)}%` }}
      transition={reduceMotion ? { duration: 0 } : transition}
      initial={reduceMotion ? false : initial}
      {...props}
    />
  );
}

export {
  Progress,
  ProgressIndicator,
  useProgress,
  type ProgressProps,
  type ProgressIndicatorProps,
  type ProgressContextType,
};
