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

const CONTAINER_LABEL = SHARED_TEXTS.toast.region
/** Nombre accesible del botón que cierra un aviso. */
const CLOSE_LABEL = SHARED_TEXTS.toast.close

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
          toast: "shadow-overlay",
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
