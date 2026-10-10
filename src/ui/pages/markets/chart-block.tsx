import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChartNoAxesColumn } from "lucide-react";
import { MARKETS_TEXTS } from "@/application/markets/presentation/texts";
import type { MarketListStatus } from "@/domain/markets/listing";
import { cn } from "@/lib/utils";
import { STAGGER, STATE_SWAP, entrance } from "@/ui/pages/markets/motion/presets";
import { EmptyState, ErrorState, LoadingRegion, Panel } from "@/ui/shared";

/** El `Panel` compartido, sin tocarlo, como componente de Motion. */
const MotionPanel = motion.create(Panel);
/** Un espacio que no se parte: guarda la línea de la descripción cuando aún no hay texto. */
const RESERVED_LINE = "\u00A0";
/**
 * El error en su forma compacta (`inline`), llenando el hueco reservado en vez de estirarlo:
 * en una tarjeta estrecha va en columna y centrado; desde 448 px de tarjeta (`@md`), en fila.
 * Así la tarjeta mide lo mismo que con la gráfica, sea corto o largo el mensaje.
 */
const ERROR_FILL =
  "grid flex-1 content-center justify-items-center text-center @md:flex @md:flex-nowrap @md:px-4 @md:text-left";

export interface ChartBlockProps {
  /** Id del título (lo enlaza `aria-labelledby`). */
  titleId: string;
  title: string;
  /** Si falta (mientras carga), su línea queda reservada para que la tarjeta no crezca después. */
  description?: string;
  /** Puesto de la tarjeta en la fila: decide cuánto espera para entrar. */
  index: number;
  slot: string;
  status: MarketListStatus;
  errorMessage: string;
  isFetching: boolean;
  onRetry: () => void;
  loadingLabel: string;
  /** Esqueleto con la forma de la gráfica. */
  skeleton: ReactNode;
  /** Alto mínimo del hueco de la gráfica, para que vacío y error no encojan la tarjeta. */
  bodyClassName?: string;
  /** La gráfica: solo se pinta en `ready`. */
  children: ReactNode;
}

/**
 * Tarjeta de una gráfica de Mercados con sus 4 estados; en error no pinta datos viejos.
 * En vacío solo explica qué pasa: la acción para salir («Limpiar filtros» o «Volver a
 * intentar») está una sola vez, en la lista, para no repetir el mismo botón tres veces.
 */
export function ChartBlock({
  titleId,
  title,
  description,
  index,
  slot,
  status,
  errorMessage,
  isFetching,
  onRetry,
  loadingLabel,
  skeleton,
  bodyClassName,
  children,
}: ChartBlockProps) {
  const reducedMotion = useReducedMotion() === true;
  const isEmpty = status === "empty-filters" || status === "empty-api";

  return (
    <MotionPanel
      aria-labelledby={titleId}
      aria-busy={status === "loading"}
      data-slot={slot}
      data-status={status}
      {...entrance(index, STAGGER.card, reducedMotion)}
    >
      <Panel.Header>
        <div className="min-w-0">
          <Panel.Title id={titleId}>{title}</Panel.Title>
          <Panel.Description aria-hidden={description ? undefined : true}>
            {description ?? RESERVED_LINE}
          </Panel.Description>
        </div>
      </Panel.Header>
      <Panel.Body>
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            data-slot="markets-chart-state"
            // Vacío y error llenan el alto reservado: ni queda un hueco debajo ni crece la tarjeta.
            className={cn(bodyClassName, (isEmpty || status === "error") && "@container flex flex-col")}
            {...STATE_SWAP}
          >
            {status === "error" ? (
              <ErrorState
                layout="inline"
                className={ERROR_FILL}
                title={MARKETS_TEXTS.errorTitle}
                message={errorMessage}
                onRetry={onRetry}
                isRetrying={isFetching}
              />
            ) : status === "loading" ? (
              <LoadingRegion label={loadingLabel}>{skeleton}</LoadingRegion>
            ) : status === "ready" ? (
              children
            ) : (
              <EmptyState
                icon={ChartNoAxesColumn}
                headingLevel="h3"
                size="sm"
                className="flex-1"
                title={MARKETS_TEXTS.chartsEmptyTitle}
                description={status === "empty-api" ? MARKETS_TEXTS.emptyApiDescription : MARKETS_TEXTS.emptyDescription}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Panel.Body>
    </MotionPanel>
  );
}
