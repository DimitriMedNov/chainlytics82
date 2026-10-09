import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { AnalystMessage } from "@/domain/analyst/message";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { AnalystBubble } from "@/ui/analyst/AnalystBubble";
import { AnalystMarkdown } from "@/ui/analyst/AnalystMarkdown";
import { FADE_HIDDEN, FADE_VISIBLE, RISE_HIDDEN, RISE_VISIBLE } from "@/ui/analyst/analystMotion";

export interface AnalystMessageListProps {
  messages: readonly AnalystMessage[];
}

/**
 * Los mensajes: el del usuario en texto plano, el del asistente en Markdown.
 *
 * - La pregunta entra con fundido y una subida corta.
 * - La respuesta ocupa el sitio exacto que tenía «Analizando...»: su fila no
 *   se mueve y solo se funde el texto, una vez (los trozos siguientes no
 *   reaniman nada y la altura nunca se anima).
 * - `initial={false}`: al reabrir el panel, lo ya conversado no vuelve a entrar.
 * - Sin salida animada: la respuesta a medias que se retira tras un error se va
 *   de golpe y la franja de error ocupa su sitio.
 */
export function AnalystMessageList({ messages }: AnalystMessageListProps) {
  // La lista existe aunque esté vacía (oculta): así la primera pregunta también
  // entra animada, porque `AnimatePresence` ya estaba montado cuando llega.
  return (
    <ol className={cn("flex flex-col gap-4", messages.length === 0 && "hidden")}>
      <AnimatePresence initial={false}>
        {messages.map((message) =>
          message.role === "assistant" ? (
            <li key={message.id}>
              <AnalystBubble role="assistant">
                <motion.div initial={FADE_HIDDEN} animate={FADE_VISIBLE}>
                  <AnalystMarkdown>{message.content || ANALYST_TEXTS.emptyAnswer}</AnalystMarkdown>
                </motion.div>
              </AnalystBubble>
            </li>
          ) : (
            <motion.li key={message.id} initial={RISE_HIDDEN} animate={RISE_VISIBLE}>
              <AnalystBubble role="user">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </AnalystBubble>
            </motion.li>
          ),
        )}
      </AnimatePresence>
    </ol>
  );
}
