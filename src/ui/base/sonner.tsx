import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useEffect } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { SHARED_TEXTS } from "@/application/shared/presentation/texts"
import { useTheme } from "@/hooks/theme/useTheme"
import { cn } from "@/lib/utils"

const CONTAINER_LABEL = SHARED_TEXTS.toast.region
/** Nombre accesible del botón que cierra un aviso. */
const CLOSE_LABEL = SHARED_TEXTS.toast.close

/**
 * Con «reducir movimiento» el aviso solo se funde. sonner coloca y anima cada
 * aviso con `transform` (entra deslizando, se encoge al apilarse, sube al
 * abrir la pila) y su propia regla de reduced-motion solo quita la
 * transición: el transform sigue saltando de un valor a otro. Aquí se anula
 * el transform y la misma colocación se hace con `bottom`/`top`, usando las
 * variables que sonner ya escribe en cada aviso:
 * - pila cerrada: cada aviso anterior asoma un `--gap` por detrás del último;
 * - pila abierta (ratón encima o foco): cada aviso en su `--offset`.
 * Los valores entre corchetes son cálculos sobre variables de sonner, no
 * medidas fijas. Los `!` ganan a las reglas `!important` de sonner porque las
 * utilidades de Tailwind van en una capa y las de sonner no.
 * Arrastrar un aviso para descartarlo sigue funcionando, pero sin seguir al dedo.
 */
const REDUCED_MOTION_TOAST = cn(
  "motion-reduce:!transform-none motion-reduce:!transition-opacity motion-reduce:!duration-200",
  "motion-reduce:data-[y-position=bottom]:data-[expanded=false]:!bottom-[calc(var(--toasts-before)*var(--gap))]",
  "motion-reduce:data-[y-position=bottom]:data-[expanded=true]:!bottom-(--offset)",
  "motion-reduce:data-[y-position=top]:data-[expanded=false]:!top-[calc(var(--toasts-before)*var(--gap))]",
  "motion-reduce:data-[y-position=top]:data-[expanded=true]:!top-(--offset)"
)

/**
 * sonner 1.6 escribe «Close toast» en el botón de cierre y su `Toaster` no
 * deja cambiarlo. Se corrige en el DOM: cada vez que aparece un aviso, su
 * botón recibe el nombre en español. React no lo pisa (para él ese atributo
 * no cambia nunca).
 */
function useSpanishCloseLabel() {
  useEffect(() => {
    const region = document.querySelector(
      `section[aria-label^="${CONTAINER_LABEL}"]`
    )
    if (!region) return
    const relabel = () => {
      for (const button of region.querySelectorAll("[data-close-button]")) {
        if (button.getAttribute("aria-label") !== CLOSE_LABEL) {
          button.setAttribute("aria-label", CLOSE_LABEL)
        }
      }
    }
    relabel()
    const observer = new MutationObserver(relabel)
    observer.observe(region, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])
}

/**
 * Adaptado al proyecto: lee el tema de `@/hooks/theme/useTheme` (no de
 * `next-themes`, que la app no monta) y los colores de los tokens HSL.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()
  useSpanishCloseLabel()

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      containerAriaLabel={CONTAINER_LABEL}
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-link" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin motion-reduce:animate-none" />,
      }}
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: cn("shadow-overlay", REDUCED_MOTION_TOAST),
          description: "!text-muted-foreground",
          // El botón de cierre de sonner mide 20 px. Aquí el botón ocupa
          // 44 px (área táctil) y es transparente; el círculo de 20 px que se
          // ve es su icono, en el mismo sitio de la esquina.
          closeButton:
            "!size-11 !border-0 !bg-transparent -translate-1 *:size-5 *:rounded-full *:border *:border-border *:bg-popover *:p-1 *:text-foreground hover:*:bg-accent",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
