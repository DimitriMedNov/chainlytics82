import { useEffect, useRef } from "react";

/** Los grupos SVG que `liquid-gooey` dibuja como capa decorativa (silueta y fundido). */
const LIQUID_LAYERS = "svg[data-gooey-svg] g, svg[data-gooey-overlay] g";

/**
 * Saca del orden de Tab la capa decorativa de `liquid-gooey`.
 *
 * La librería ya marca sus SVG con `aria-hidden` y `focusable="false"`, pero en
 * Chromium el grupo de la silueta sigue recibiendo el foco al tabular (una
 * parada sin nombre antes del campo). No ofrece prop para evitarlo, así que se
 * le pone `tabindex="-1"` desde fuera: React no gestiona ese atributo en esos
 * nodos, de modo que sobrevive a los renders.
 *
 * @returns ref para el contenedor que envuelve al `<Liquid>`.
 */
export function useLiquidOutOfTabOrder<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.querySelectorAll(LIQUID_LAYERS).forEach((layer) => layer.setAttribute("tabindex", "-1"));
  }, []);

  return ref;
}
