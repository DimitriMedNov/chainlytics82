import { Zap } from "lucide-react";
import { motion } from "motion/react";
import { CONVERTER_TEXTS } from "@/application/converter/presentation/texts";
import { formatCurrency } from "@/application/shared/presentation/format";
import type { Converter } from "@/hooks/converter/useConverter";
import { BlockStates } from "@/ui/pages/converter/block-states";
import { useRowStagger } from "@/ui/pages/converter/converter-motion";
import { QuickListSkeleton } from "@/ui/pages/converter/converter-skeletons";
import { Panel } from "@/ui/shared";

const TITLE_ID = "converter-quick-title";

export interface QuickPanelProps {
  quick: Converter["quick"];
}

/** Lateral «Conversiones rápidas»: 1 BTC, 1 ETH, 10 SOL y 1000 ADA en dólares. */
export function QuickPanel({ quick }: QuickPanelProps) {
  const texts = CONVERTER_TEXTS.quick;
  const stagger = useRowStagger();

  return (
    <Panel aria-labelledby={TITLE_ID} data-slot="converter-quick">
      <Panel.Header>
        <Panel.Title id={TITLE_ID}>{texts.title}</Panel.Title>
      </Panel.Header>
      <Panel.Body padding="flush">
        <BlockStates block={quick} texts={texts} emptyIcon={Zap} skeleton={<QuickListSkeleton />} compact>
          <motion.ul className="divide-y" variants={stagger.list} initial="hidden" animate="visible">
            {quick.rows.map((row) => (
              <motion.li
                key={row.code}
                variants={stagger.row}
                className="flex min-h-14 items-center justify-between gap-3 px-4 py-2 sm:px-5"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="type-num text-sm font-medium text-foreground">
                    {texts.amountLabel(row.amount, row.code)}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">{texts.caption(row.name)}</span>
                </div>
                <span className="type-num shrink-0 text-sm font-medium text-foreground">
                  {formatCurrency(row.value)}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </BlockStates>
      </Panel.Body>
    </Panel>
  );
}
