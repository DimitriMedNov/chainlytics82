import { useCallback, useState } from "react";
import { isBlankQuestion } from "@/domain/analyst/message";

export interface AnalystDraft {
  value: string;
  setValue: (value: string) => void;
  /** Hay algo escrito que enviar. */
  canSend: boolean;
  /** Envía el borrador; solo lo vacía si el envío se aceptó. */
  submit: () => void;
}

/** Borrador del campo de pregunta (estado de interfaz, no del chat). */
export function useAnalystDraft(send: (text: string) => boolean): AnalystDraft {
  const [value, setValue] = useState("");

  const submit = useCallback(() => {
    if (send(value)) setValue("");
  }, [send, value]);

  return { value, setValue, canSend: !isBlankQuestion(value), submit };
}
