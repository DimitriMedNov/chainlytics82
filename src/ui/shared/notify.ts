import { toast } from "sonner";

export interface NotifyAction {
  label: string;
  onClick: () => void;
}

export interface NotifyOptions {
  /** Segunda línea, más pequeña. */
  description?: string;
  /** Botón dentro del aviso (por ejemplo "Deshacer" o "Reintentar"). */
  action?: NotifyAction;
  /** Con el mismo id, un aviso nuevo sustituye al anterior en vez de apilarse. */
  id?: string;
  /** Milisegundos en pantalla. Por defecto, el de sonner (4 s). */
  duration?: number;
}

type NotifyId = string | number;

/**
 * Único punto de entrada a los avisos (sonner). Las pantallas importan esto,
 * nunca `sonner`: así hay un solo sistema de avisos en toda la app.
 */
export const notify = {
  success: (title: string, options?: NotifyOptions): NotifyId => toast.success(title, options),
  error: (title: string, options?: NotifyOptions): NotifyId => toast.error(title, options),
  info: (title: string, options?: NotifyOptions): NotifyId => toast.info(title, options),
  warning: (title: string, options?: NotifyOptions): NotifyId => toast.warning(title, options),
  dismiss: (id?: NotifyId): void => {
    toast.dismiss(id);
  },
};
