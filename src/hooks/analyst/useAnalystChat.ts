import { useCallback, useEffect, useReducer, useRef } from "react";
import { useDeps } from "@/app/deps";
import { ANALYST_SIGN_IN_REQUIRED, mustSignOut } from "@/application/analyst/errors";
import {
  canRetry as canRetryChat,
  chatReducer,
  INITIAL_CHAT,
  isBusy,
  type ChatStatus,
} from "@/domain/analyst/chat";
import { isBlankQuestion, type AnalystMessage } from "@/domain/analyst/message";
import { useSession } from "@/hooks/session/useSession";

export interface UseAnalystChatOptions {
  /**
   * Recibe el texto de cada aviso (error de la IA, o intento de preguntar sin
   * sesión), una vez por aviso. Quien llama lo enseña (antes era un toast de error).
   */
  onNotice?: (text: string) => void;
}

export interface AnalystChat {
  messages: AnalystMessage[];
  /** Estado de la máquina: `idle`, `waiting`, `streaming` o `error`. */
  status: ChatStatus;
  /** `true` en `waiting` y `streaming` (el `loading` de antes). */
  busy: boolean;
  /** Texto exacto del aviso de error; `null` si el estado no es `error`. */
  errorMessage: string | null;
  /** `true` si `retry()` tiene una pregunta que reenviar. */
  canRetry: boolean;
  /** Devuelve `false` si no se envió (vacío, ocupado o sin sesión). */
  send: (text: string) => boolean;
  /** Corta la respuesta en curso. Lo ya escrito se queda. */
  stop: () => void;
  /** Reenvía la última pregunta tras un error. `false` si no se reenvió. */
  retry: () => boolean;
}

/**
 * Conversación con el analista IA. Si el componente se desmonta a media
 * respuesta, la petición se cancela en vez de seguir escribiendo en el vacío.
 */
export function useAnalystChat({ onNotice }: UseAnalystChatOptions = {}): AnalystChat {
  const { analyst } = useDeps();
  const { session, signOut } = useSession();
  const [chat, dispatch] = useReducer(chatReducer, INITIAL_CHAT);
  const controllerRef = useRef<AbortController | null>(null);

  // El aviso siempre usa la última función recibida.
  const notify = useRef(onNotice);
  useEffect(() => {
    notify.current = onNotice;
  }, [onNotice]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const ask = useCallback(
    (accessToken: string, conversation: readonly AnalystMessage[], answerId: string) => {
      const controller = new AbortController();
      controllerRef.current = controller;

      void analyst
        .ask({
          accessToken,
          conversation,
          signal: controller.signal,
          onText: (acumulado) => dispatch({ type: "chunk", answerId, acumulado }),
        })
        .then((result) => {
          if (controllerRef.current === controller) controllerRef.current = null;
          if (result.ok) {
            if (result.value === "done") dispatch({ type: "finished", answerId });
            return;
          }
          if (mustSignOut(result.error)) void signOut();
          notify.current?.(result.error.message);
          dispatch({ type: "failed", answerId, message: result.error.message });
        });
    },
    [analyst, signOut],
  );

  const send = useCallback(
    (text: string) => {
      if (isBlankQuestion(text) || isBusy(chat.status)) return false;
      if (!session) {
        notify.current?.(ANALYST_SIGN_IN_REQUIRED);
        return false;
      }
      const question: AnalystMessage = { id: crypto.randomUUID(), role: "user", content: text };
      const answerId = crypto.randomUUID();
      dispatch({ type: "asked", question, answerId });
      ask(session.accessToken, [...chat.messages, question], answerId);
      return true;
    },
    [ask, chat.messages, chat.status, session],
  );

  const retry = useCallback(() => {
    if (!canRetryChat(chat)) return false;
    if (!session) {
      notify.current?.(ANALYST_SIGN_IN_REQUIRED);
      return false;
    }
    const answerId = crypto.randomUUID();
    dispatch({ type: "retried", answerId });
    ask(session.accessToken, chat.messages, answerId);
    return true;
  }, [ask, chat, session]);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    dispatch({ type: "stopped" });
  }, []);

  return {
    messages: chat.messages,
    status: chat.status,
    busy: isBusy(chat.status),
    errorMessage: chat.error,
    canRetry: canRetryChat(chat),
    send,
    stop,
    retry,
  };
}
