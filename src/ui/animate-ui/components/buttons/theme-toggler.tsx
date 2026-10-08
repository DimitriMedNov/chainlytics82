'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';

import {
  ThemeToggler as ThemeTogglerPrimitive,
  type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
  type ThemeSelection,
  type Resolved,
} from '@/ui/animate-ui/primitives/effects/theme-toggler';
import { buttonVariants } from '@/ui/animate-ui/components/buttons/icon';
import { cn } from '@/lib/utils';
// Adaptado al proyecto: el tema sale del hook propio, no de `next-themes`.
import { useTheme } from '@/hooks/theme/useTheme';

const getIcon = (
  effective: ThemeSelection,
  resolved: Resolved,
  modes: ThemeSelection[],
) => {
  const theme = modes.includes('system') ? effective : resolved;
  return theme === 'system' ? (
    <Monitor aria-hidden="true" />
  ) : theme === 'dark' ? (
    <Moon aria-hidden="true" />
  ) : (
    <Sun aria-hidden="true" />
  );
};

const THEME_NAMES: Record<ThemeSelection, string> = {
  light: 'claro',
  dark: 'oscuro',
  system: 'del sistema',
};

/** Nombre accesible en español: dice el tema actual y a cuál se cambia. */
const getLabel = (effective: ThemeSelection, modes: ThemeSelection[]) =>
  `Tema ${THEME_NAMES[effective]}. Cambiar a tema ${THEME_NAMES[getNextTheme(effective, modes)]}`;

function getNextTheme(
  effective: ThemeSelection,
  modes: ThemeSelection[],
): ThemeSelection {
  const i = modes.indexOf(effective);
  if (i === -1) return modes[0];
  return modes[(i + 1) % modes.length];
}

type ThemeTogglerButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    modes?: ThemeSelection[];
    onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange'];
    direction?: ThemeTogglerPrimitiveProps['direction'];
  };

function ThemeTogglerButton({
  variant = 'default',
  size = 'default',
  modes = ['light', 'dark', 'system'],
  direction = 'ltr',
  onImmediateChange,
  onClick,
  className,
  ...props
}: ThemeTogglerButtonProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <ThemeTogglerPrimitive
      theme={theme}
      resolvedTheme={resolvedTheme}
      setTheme={setTheme}
      direction={direction}
      onImmediateChange={onImmediateChange}
    >
      {({ effective, resolved, toggleTheme }) => (
        <button
          type="button"
          data-slot="theme-toggler-button"
          aria-label={getLabel(effective, modes)}
          title={getLabel(effective, modes)}
          className={cn(buttonVariants({ variant, size, className }))}
          onClick={(e) => {
            onClick?.(e);
            toggleTheme(getNextTheme(effective, modes));
          }}
          {...props}
        >
          {getIcon(effective, resolved, modes)}
        </button>
      )}
    </ThemeTogglerPrimitive>
  );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
