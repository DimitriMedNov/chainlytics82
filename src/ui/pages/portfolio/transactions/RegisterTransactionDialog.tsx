import type { JSX } from "react";
import { X } from "lucide-react";
import { CLOSE_LABEL, REGISTER_TRANSACTION_LABEL, TRANSACTION_DIALOG_DESCRIPTION } from "@/application/portfolio-screen/messages";
import type { Coin } from "@/domain/market/coin";
import type { NewTransaction } from "@/domain/portfolio/types";
import { useTransactionForm } from "@/hooks/portfolio-screen/useTransactionForm";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/animate-ui/components/radix/dialog";
import { dialogMotion } from "@/ui/pages/portfolio/motion";
import { TransactionFormFields } from "./TransactionFormFields";

export interface RegisterTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Top 100 para el select (`screen.coins`). */
  coins: Coin[];
  /** Guarda el movimiento ya validado (`screen.registerTransaction`). Sin aviso. */
  onRegister: (tx: NewTransaction) => null;
}

/**
 * Diálogo «Registrar movimiento». El disparador y el estado `open` son del
 * contenedor; al cerrar, el `Dialog` de Animate UI devuelve el foco al botón
 * que lo abrió (cabecera o estado vacío).
 */
export function RegisterTransactionDialog({
  open,
  onOpenChange,
  coins,
  onRegister,
}: RegisterTransactionDialogProps): JSX.Element {
  const form = useTransactionForm({ coins, onRegister, onDone: () => onOpenChange(false) });

  // Cerrar por cualquier vía (Escape, fondo, botón) limpia el formulario.
  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        {...dialogMotion}
        showCloseButton={false}
        className="max-h-dvh overflow-y-auto rounded-xl bg-popover text-popover-foreground shadow-overlay sm:max-w-md"
      >
        <DialogHeader className="pr-10 text-left">
          <DialogTitle>{REGISTER_TRANSACTION_LABEL}</DialogTitle>
          <DialogDescription>{TRANSACTION_DIALOG_DESCRIPTION}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
          <TransactionFormFields form={form} coins={coins} />
          <Button type="submit" className="min-h-11 w-full">
            {form.submitLabel}
          </Button>
        </form>

        <DialogClose asChild>
          <button
            type="button"
            aria-label={CLOSE_LABEL}
            className="absolute right-2 top-2 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
