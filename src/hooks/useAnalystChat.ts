import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AnalystError, streamAnalyst, type AnalystMessage } from "@/lib/analystStream";

export interface AnalystChat {
  messages: AnalystMessage[];
  loading: boolean;
  /** Devuelve `false` si no se envió (vacío, ocupado o sin sesión). */
  send: (text: string) => boolean;
}

/**
 * Conversación con el analista IA. Si el componente se desmonta a media
 * respuesta, la petición se cancela en vez de seguir escribiendo en el vacío.
 */
export function useAnalystChat(): AnalystChat {
  const { session } = useAuth();
  const [messages, setMessages] = useState<AnalystMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || loading) return false;
      if (!session) {
        toast.error("Debes iniciar sesión para usar la IA");
        return false;
      }

      const userMsg: AnalystMessage = { id: crypto.randomUUID(), role: "user", content: text };
      const assistantId = crypto.randomUUID();
      const history = [...messages, userMsg];
      setMessages(history);
      setLoading(true);

      const controller = new AbortController();
      controllerRef.current = controller;

      const onText = (acumulado: string) => {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.id === assistantId) {
            return [...prev.slice(0, -1), { ...last, content: acumulado }];
          }
          return [...prev, { id: assistantId, role: "assistant", content: acumulado }];
        });
      };

      streamAnalyst({
        accessToken: session.access_token,
        messages: history.map(({ role, content }) => ({ role, content })),
        signal: controller.signal,
        onText,
      })
        .catch((e: unknown) => {
          if (controller.signal.aborted) return;
          if (e instanceof AnalystError && e.status === 401) void supabase.auth.signOut();
          toast.error(e instanceof AnalystError ? e.message : "No se pudo obtener respuesta de la IA");
          // Se quita la respuesta a medias para no dejar un mensaje cortado.
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        })
        .finally(() => {
          if (controllerRef.current === controller) controllerRef.current = null;
          if (!controller.signal.aborted) setLoading(false);
        });
      return true;
    },
    [loading, messages, session],
  );

  return { messages, loading, send };
}
