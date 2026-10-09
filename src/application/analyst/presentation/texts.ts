/**
 * Textos del Analista IA, tal como estaban en la interfaz anterior
 * (`src/components/AICryptoAnalyst.tsx`, `src/components/analyst/*`). Los
 * marcados como «nuevo» son de acciones que antes no existían.
 *
 * Aparte siguen: los avisos de error (`../errors.ts`), las sugerencias
 * (`ANALYST_SUGGESTIONS`, en `domain/analyst/message.ts`) y el saludo
 * («Hola, ana», `analystGreeting` en `domain/analyst/intro.ts`).
 */
export const ANALYST_TEXTS = {
  /** Nombre accesible (`aria-label`) del botón flotante. */
  openLabel: "Abrir el analista con IA",
  title: "CryptoSense AI",
  badge: "Tu analista crypto con IA",
  /** Nuevo: nombre accesible del botón propio que cierra el panel. */
  closeLabel: "Cerrar el analista",

  signin: {
    title: "Inicia sesión para continuar",
    description: "El analista IA solo está disponible para usuarios autenticados.",
    action: "Iniciar sesión / Registrarse",
    actionHref: "/auth",
  },

  unavailable: {
    title: "El analista no está disponible",
    description:
      "Se ejecuta en el servidor, y ahora mismo el servicio no responde. Los precios de la app siguen funcionando.",
  },

  welcome: {
    description: "Pregúntame sobre el mercado, monedas específicas, tendencias o conceptos.",
    suggestionsLabel: "Sugerencias:",
  },

  form: {
    /** Label oculto del campo (`htmlFor="analyst-input"`). */
    inputLabel: "Tu pregunta",
    inputPlaceholder: "Pregunta sobre el mercado crypto...",
    sendLabel: "Enviar pregunta",
    /** Nuevo: botón que corta la respuesta en curso (`stop()`). */
    stopLabel: "Detener la respuesta",
  },

  /** Indicador hasta que llega el primer trozo de la respuesta. */
  thinking: "Analizando...",
  /** Lo que se pinta en una burbuja del asistente aún sin texto. */
  emptyAnswer: "…",

  /** Nuevo: botón del aviso de error (`retry()`, si `canRetry`). */
  retry: "Reintentar",

  /** Nuevo: nombre accesible de los bloques de código de las respuestas. */
  codeBlockLabel: "Bloque de código",
} as const;
