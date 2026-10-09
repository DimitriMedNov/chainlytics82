import { motion } from "motion/react";
import { CONVERTER_TEXTS } from "@/application/converter/presentation/texts";
import { useConverter } from "@/hooks/converter/useConverter";
import { ConverterFormPanel } from "@/ui/pages/converter/converter-form-panel";
import { usePanelEntrance } from "@/ui/pages/converter/converter-motion";
import { QuickPanel } from "@/ui/pages/converter/quick-panel";
import { RatesPanel } from "@/ui/pages/converter/rates-panel";
import { useCopyResult } from "@/ui/pages/converter/use-copy-result";
import { PageContainer, PageGrid, PageHeader } from "@/ui/shared";

/** Pantalla `/converter`: formulario a la izquierda; tasas y atajos en el lateral. */
export default function ConverterPage() {
  const converter = useConverter();
  const copyResult = useCopyResult(converter.form.copy);
  const panel = usePanelEntrance();

  return (
    <PageContainer>
      <PageHeader title={CONVERTER_TEXTS.title} description={CONVERTER_TEXTS.subtitle} />
      <PageGrid layout="main">
        <motion.div className="min-w-0 self-start" variants={panel} custom={0} initial="hidden" animate="visible">
          <ConverterFormPanel converter={converter} onCopy={copyResult} />
        </motion.div>
        <div className="flex min-w-0 flex-col gap-6">
          <motion.div className="min-w-0" variants={panel} custom={1} initial="hidden" animate="visible">
            <RatesPanel rates={converter.rates} />
          </motion.div>
          <motion.div className="min-w-0" variants={panel} custom={2} initial="hidden" animate="visible">
            <QuickPanel quick={converter.quick} />
          </motion.div>
        </div>
      </PageGrid>
    </PageContainer>
  );
}
