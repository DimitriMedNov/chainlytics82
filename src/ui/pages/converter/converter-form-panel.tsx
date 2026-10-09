import { CONVERTER_TEXTS } from "@/application/converter/presentation/texts";
import type { Converter } from "@/hooks/converter/useConverter";
import { motion } from "motion/react";
import { ConverterFields } from "@/ui/pages/converter/converter-fields";
import { FADE } from "@/ui/pages/converter/converter-motion";
import { ConverterFormSkeleton } from "@/ui/pages/converter/converter-skeletons";
import { ErrorState, LoadingRegion, Panel } from "@/ui/shared";

const TITLE_ID = "converter-form-title";

export interface ConverterFormPanelProps {
  converter: Pick<Converter, "form" | "options" | "status" | "errorMessage" | "isRetrying" | "refetch">;
  onCopy: () => void;
  className?: string;
}

/** Tarjeta «Convertidor». Error (manda) → cargando → formulario; el vacío es el del resultado. */
export function ConverterFormPanel({ converter, onCopy, className }: ConverterFormPanelProps) {
  const texts = CONVERTER_TEXTS.form;

  return (
    <Panel aria-labelledby={TITLE_ID} data-slot="converter-form" className={className}>
      <Panel.Header>
        <Panel.Title id={TITLE_ID}>{texts.title}</Panel.Title>
      </Panel.Header>
      <Panel.Body>
        {converter.status === "error" ? (
          <ErrorState
            title={texts.errorTitle}
            message={converter.errorMessage}
            onRetry={converter.refetch}
            isRetrying={converter.isRetrying}
          />
        ) : converter.status === "loading" ? (
          <LoadingRegion label={texts.loading}>
            <ConverterFormSkeleton />
          </LoadingRegion>
        ) : (
          <motion.div className="min-w-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={FADE}>
            <ConverterFields form={converter.form} options={converter.options} onCopy={onCopy} />
          </motion.div>
        )}
      </Panel.Body>
    </Panel>
  );
}
