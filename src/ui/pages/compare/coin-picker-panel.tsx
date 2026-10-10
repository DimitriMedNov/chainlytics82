import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import type { CompareScreen } from "@/hooks/compare/useCompareScreen";
import { motion } from "motion/react";
import { ErrorState, LoadingRegion, Panel, Skeleton } from "@/ui/shared";
import { AddCoinField } from "@/ui/pages/compare/add-coin-field";
import { CoinChips } from "@/ui/pages/compare/coin-chips";
import { COMPARE_IDS } from "@/ui/pages/compare/constants";
import { ENTER } from "@/ui/pages/compare/motion";
import { RevealPanel } from "@/ui/pages/compare/reveal-panel";
import { StateSwap } from "@/ui/pages/compare/state-swap";
import { useChipFocus } from "@/ui/pages/compare/use-chip-focus";
import { useWasEver } from "@/ui/pages/compare/use-was-ever";

export interface CoinPickerPanelProps {
  picker: CompareScreen["picker"];
}

const TEXTS = COMPARE_TEXTS.picker;
const LAYOUT = "grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end";

/** Con la forma del bloque: dos chips, la etiqueta y el selector. */
function CoinPickerSkeleton() {
  return (
    <LoadingRegion label={TEXTS.loadingLabel}>
      <div className={LAYOUT}>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-11 w-24 rounded-full" />
          <Skeleton className="h-11 w-24 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-4 w-48 max-w-full" />
        </div>
      </div>
    </LoadingRegion>
  );
}

/** Bloque «Qué comparar»: monedas elegidas y selector para añadir otra. */
export function CoinPickerPanel({ picker }: CoinPickerPanelProps) {
  /** Si la lista nace tras un «ninguna elegida», su primer chip entra animado. */
  const wasEmpty = useWasEver(picker.status === "empty");
  /** Vacío y con monedas comparten estado: el selector no se desmonta (ni pierde el foco). */
  const stateKey = picker.status === "error" || picker.status === "loading" ? picker.status : "content";
  /** Al quitar un chip, el foco pasa al vecino o al selector (no se queda en `<body>`). */
  const chipFocus = useChipFocus(picker.selected, picker.remove);

  return (
    <RevealPanel order={0} aria-labelledby={COMPARE_IDS.picker} data-slot="compare-picker">
      <Panel.Header>
        <Panel.Title id={COMPARE_IDS.picker}>{TEXTS.title}</Panel.Title>
      </Panel.Header>
      <Panel.Body>
        <StateSwap stateKey={stateKey}>
          {picker.status === "error" ? (
            <ErrorState
              title={TEXTS.errorTitle}
              message={picker.errorMessage}
              onRetry={picker.retry}
              isRetrying={picker.isRetrying}
            />
          ) : picker.status === "loading" ? (
            <CoinPickerSkeleton />
          ) : (
            <div ref={chipFocus.regionRef} className={LAYOUT}>
              {picker.status === "empty" ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={ENTER}
                  className="self-center text-sm text-muted-foreground"
                >
                  {TEXTS.noneSelected}
                </motion.p>
              ) : (
                <CoinChips
                  selected={picker.selected}
                  onRemove={chipFocus.onRemove}
                  labelledBy={COMPARE_IDS.picker}
                  animateInitial={wasEmpty}
                />
              )}
              <AddCoinField
                available={picker.available}
                max={picker.max}
                isFull={picker.isFull}
                onAdd={picker.add}
              />
            </div>
          )}
        </StateSwap>
      </Panel.Body>
    </RevealPanel>
  );
}
