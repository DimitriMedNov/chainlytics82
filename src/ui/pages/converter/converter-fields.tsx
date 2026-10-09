import { motion } from "motion/react";
import { CONVERTER_TEXTS } from "@/application/converter/presentation/texts";
import type { Convertible } from "@/domain/converter/convertible";
import type { ConverterForm } from "@/hooks/converter/useConverterForm";
import { Input } from "@/ui/base/input";
import { Label } from "@/ui/base/label";
import { useSwapMotion, useTextEntrance } from "@/ui/pages/converter/converter-motion";
import { CurrencyField } from "@/ui/pages/converter/currency-field";
import { ResultField } from "@/ui/pages/converter/result-field";
import { SwapButton } from "@/ui/pages/converter/swap-button";

const AMOUNT_ID = "convert-amount";
/** Los dos bloques apilados de la tarjeta de intercambio (Watermelon «Swap Currency Card»). */
const BLOCK = "grid min-w-0 gap-4 rounded-lg bg-elevated p-4 sm:grid-cols-2 sm:p-5";

export interface ConverterFieldsProps {
  form: ConverterForm;
  options: readonly Convertible[];
  onCopy: () => void;
}

/** Formulario: cantidad + «Desde», botón de intercambio, resultado + «Hacia» y la línea resumen. */
export function ConverterFields({ form, options, onCopy }: ConverterFieldsProps) {
  const texts = CONVERTER_TEXTS.form;
  const swap = useSwapMotion(form.swap);
  const summaryEntrance = useTextEntrance();

  return (
    <div ref={swap.scope} data-slot="converter-fields" className="flex min-w-0 flex-col">
      <div data-slot="converter-from" className={BLOCK}>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex min-h-6 items-center">
            <Label htmlFor={AMOUNT_ID}>{texts.amountLabel}</Label>
          </div>
          <Input
            id={AMOUNT_ID}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder={texts.amountPlaceholder}
            value={form.amount}
            onChange={(event) => form.setAmount(event.target.value)}
            className="type-num h-11 bg-card font-medium"
          />
        </div>
        <CurrencyField
          id="convert-from"
          label={texts.fromLabel}
          value={form.fromCode}
          selected={form.from}
          options={options}
          onChange={form.setFromCode}
        />
      </div>

      <div className="relative z-10 -my-3 flex justify-center">
        <SwapButton label={texts.swapLabel} turns={swap.turns} onSwap={swap.onSwap} />
      </div>

      <div data-slot="converter-to" className={BLOCK}>
        <ResultField form={form} onCopy={onCopy} />
        <CurrencyField
          id="convert-to"
          label={texts.toLabel}
          value={form.toCode}
          selected={form.to}
          options={options}
          onChange={form.setToCode}
        />
      </div>

      <p
        data-slot="converter-summary"
        aria-live="polite"
        className="type-num mt-4 min-h-5 break-words text-center text-sm font-medium text-foreground"
      >
        {form.summary ? (
          <motion.span
            key={form.summary}
            className="inline-block max-w-full"
            variants={summaryEntrance}
            initial="hidden"
            animate="visible"
          >
            {form.summary}
          </motion.span>
        ) : null}
      </p>
    </div>
  );
}
