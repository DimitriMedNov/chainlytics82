import { err, ok, type Result } from "../../domain/shared/result.ts";
import type { ClipboardPort } from "./ports.ts";

/** Texto de un aviso: título y detalle. */
export interface NoticeText {
  title: string;
  description: string;
}

/** Aviso (destructivo) que enseña quien llama cuando no se pudo copiar. */
export const COPY_FAILED: NoticeText = {
  title: "No se pudo copiar",
  description: "Tu navegador bloqueó el acceso al portapapeles.",
};

/**
 * Cuánto dura la señal de "copiado" (el icono de copiar pasa a un check).
 * El éxito no lleva aviso con texto: solo esa señal.
 */
export const COPIED_FEEDBACK_MS = 2000;

/** Copia el resultado al portapapeles. El error es el aviso para el usuario. */
export async function copyResult(
  clipboard: ClipboardPort,
  text: string,
): Promise<Result<void, NoticeText>> {
  try {
    await clipboard.writeText(text);
    return ok(undefined);
  } catch {
    return err(COPY_FAILED);
  }
}

export interface ConverterUseCases {
  copyResult(text: string): Promise<Result<void, NoticeText>>;
}

export function createConverterUseCases(clipboard: ClipboardPort): ConverterUseCases {
  return {
    copyResult: (text) => copyResult(clipboard, text),
  };
}
