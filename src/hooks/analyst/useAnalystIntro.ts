import {
  analystGreeting,
  analystUserName,
  canAskAnalyst,
  resolveAnalystIntro,
  type AnalystIntroKind,
} from "@/domain/analyst/intro";
import { ANALYST_SUGGESTIONS } from "@/domain/analyst/message";
import { useSession } from "@/hooks/session/useSession";

export interface AnalystIntro {
  /** Qué intro pintar; `null` si no toca ninguna. */
  intro: AnalystIntroKind | null;
  /** Parte del correo antes de la @; `undefined` si no hay correo. */
  userName: string | undefined;
  /** Título de la bienvenida: «Hola, ana» o «Hola». */
  greeting: string;
  /** Las preguntas de ejemplo de la bienvenida. */
  suggestions: readonly string[];
  /** `true` con sesión: se pinta el formulario de preguntar. */
  canAsk: boolean;
}

/** Qué enseñar en el panel según la sesión y si ya hay conversación. */
export function useAnalystIntro(messageCount: number): AnalystIntro {
  const { access, user } = useSession();
  const userName = analystUserName(user?.email);

  return {
    intro: resolveAnalystIntro(access, messageCount),
    userName,
    greeting: analystGreeting(userName),
    suggestions: ANALYST_SUGGESTIONS,
    canAsk: canAskAnalyst(access),
  };
}
