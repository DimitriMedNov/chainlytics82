import { motion } from "motion/react";
import { CONVERTER_TEXTS, RESULT_EMPTY_TEXTS } from "@/application/converter/presentation/texts";
import type { ConverterForm } from "@/hooks/converter/useConverterForm";
import { Input } from "@/ui/base/input";
import { Label } from "@/ui/base/label";
import { useTextEntrance, useValuePulse } from "@/ui/pages/converter/converter-motion";
import { CopyButton } from "@/ui/pages/converter/copy-button";

const RESULT_ID = "convert-result";
const HINT_ID = "convert-result-hint";

export interface ResultFieldProps {
  form: Pick<ConverterForm, "result" | "isResultEmpty" | "emptyReason" | "copied">;
  onCopy: () => void;
}

/** Campo «Resultado» de solo lectura, con el botón de copiar (solo si hay resultado) y la pista del vacío. */
export function ResultField({ form, onCopy }: ResultFieldProps) {
  const texts = CONVERTER_TEXTS.form;
  const resultRef = useValuePulse<HTMLInputElement>(form.result);
  const hintEntrance = useTextEntrance();

  return (
    <div data-slot="result-field" className="flex min-w-0 flex-col gap-2">
      <div className="flex min-h-6 items-center">
        <Label htmlFor={RESULT_ID}>{texts.resultLabel}</Label>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <Input
          ref={resultRef}
          id={RESULT_ID}
          readOnly
          value={form.result}
          placeholder={texts.resultPlaceholder}
          aria-describedby={form.emptyReason ? HINT_ID : undefined}
          className="type-num h-11 bg-card font-medium"
        />
        {form.isResultEmpty ? null : (
          <CopyButton
            label={form.copied ? texts.copiedAria : texts.copyLabel}
            copied={form.copied}
            onCopy={onCopy}
          />
        )}
        {/* Siempre en el DOM: el lector anuncia «Copiado» al llenarse. Si el portapapeles falla, `copied` no cambia. */}
        <span data-slot="copy-status" role="status" aria-live="polite" className="sr-only">
          {form.copied ? texts.copiedLabel : null}
        </span>
      </div>
      {/* Hueco reservado (dos líneas de `text-xs`): la pista entra sin mover lo de abajo. */}
      <div className="min-h-8">
        {form.emptyReason ? (
          <motion.p
            key={form.emptyReason}
            id={HINT_ID}
            className="text-xs text-muted-foreground"
            variants={hintEntrance}
            initial="hidden"
            animate="visible"
          >
            {RESULT_EMPTY_TEXTS[form.emptyReason]}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
