import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { FADE, useIconSwap } from "@/ui/pages/converter/converter-motion";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  /** Nombre accesible: quien lo usa lo cambia mientras `copied` es `true`. */
  label: string;
  /** `true` durante los 2 s siguientes a copiar. */
  copied: boolean;
  onCopy: () => void;
}

/** Botón copiar: el icono pasa a check verde y vuelve, con un cruce corto (confirma la acción). */
export function CopyButton({ label, copied, onCopy }: CopyButtonProps) {
  const icon = useIconSwap();
  const Icon = copied ? Check : Copy;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      data-copied={copied}
      onClick={onCopy}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={FADE}
      className="size-11"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          aria-hidden="true"
          className="inline-flex"
          variants={icon}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Icon className={cn(copied && "text-success")} />
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
