/**
 * Textos de la interfaz compartida, para que no se escriban a mano en los
 * componentes: `SHARED_TEXTS` para las piezas de `src/ui/shared` (y los avisos
 * de `src/ui/base/sonner.tsx`) y `SHELL_TEXTS` para el armazón (`src/ui/shell`)
 * y la página 404 (`src/ui/pages/not-found`).
 *
 * Cada texto está copiado carácter por carácter de donde estaba escrito.
 */
export const SHARED_TEXTS = {
  /** Lo que oye un lector de pantalla cuando una variación no tiene valor. */
  noData: "Sin dato",

  /** `PriceChange`: sentido de la variación, solo para lectores de pantalla. */
  priceChange: {
    up: "Sube",
    down: "Baja",
  },

  /** `ErrorState`. */
  error: {
    /** Título cuando quien lo usa no pasa uno. */
    defaultTitle: "No se pudieron cargar los datos",
    retry: "Reintentar",
    /** Mismo texto que `SEARCH_RETRYING` del buscador, que nadie importa. */
    retrying: "Reintentando…",
  },

  /** `LoadingRegion`: nombre por defecto de la zona que carga. */
  loading: {
    defaultLabel: "Cargando",
  },

  /** `RangeSelector`: nombre por defecto del grupo de botones. */
  rangeSelector: {
    defaultLabel: "Rango de la gráfica",
  },

  /** `SaveStatus`. */
  saveStatus: {
    saving: "Guardando…",
    /** «No se pudo guardar: » seguido del motivo. */
    error: (reason: string): string => `No se pudo guardar: ${reason}`,
    dismissError: "Descartar el aviso de error",
  },

  /** `ServiceUnavailable`: el botón (título y descripción: `accountServiceNotice`). */
  serviceUnavailable: {
    recheck: "Volver a comprobar",
    rechecking: "Comprobando…",
  },

  /** `StorageBadge`. */
  storage: {
    synced: "Guardado en tu cuenta",
    localOnly: "Solo en este navegador.",
    signInToSync: "Inicia sesión para sincronizar",
  },

  /** Avisos (`src/ui/base/sonner.tsx`). */
  toast: {
    /** Nombre accesible de la región que contiene los avisos. */
    region: "Avisos",
    /** Nombre accesible del botón que cierra un aviso. */
    close: "Cerrar aviso",
  },

  /** `UnderConstruction`: la descripción va partida por el nombre del archivo. */
  underConstruction: {
    title: "Pantalla en construcción",
    descriptionBeforeFile: "Esta pantalla del rediseño todavía no está escrita. Sustituye ",
    descriptionAfterFile: ".",
    backToPanel: "Volver al panel",
  },
} as const;

/** «Sin dato» o «Sin dato 24 h», según venga o no el periodo. */
export function noDataLabel(period?: string): string {
  return `${SHARED_TEXTS.noData}${period ? ` ${period}` : ""}`;
}

/** Coletilla común a los dos mensajes de una pantalla que falla. */
const ROUTE_ERROR_ADVICE = "Reintenta y, si sigue igual, recarga la página.";

export const SHELL_TEXTS = {
  /** Nombre de la marca, visible en el logo. */
  brand: "Chainlytics",

  /** Enlace para saltar la barra con el teclado (`AppLayout`). */
  skipToContent: "Saltar al contenido",

  logo: {
    /** Nombre accesible del enlace del logo. */
    label: "Chainlytics, ir al panel",
  },

  nav: {
    /** Nombre accesible de la navegación de la barra (escritorio). */
    label: "Principal",
    /** Texto de cada destino (`navigation.ts`), en el orden de la barra. */
    items: {
      panel: "Panel",
      markets: "Mercados",
      portfolio: "Portfolio",
      compare: "Comparar",
      watchlist: "Watchlist",
      converter: "Convertidor",
    },
  },

  mobileMenu: {
    open: "Abrir el menú de navegación",
    close: "Cerrar el menú",
    /** Título y descripción de la hoja, solo para lectores de pantalla. */
    title: "Menú de navegación",
    description: "Secciones de Chainlytics y tu sesión",
    /** Nombre accesible de la navegación de dentro de la hoja. */
    navLabel: "Secciones",
  },

  /** Zona de sesión: barra (`SessionArea`) y hoja del móvil (`MobileMenu`). */
  session: {
    checking: "Comprobando la sesión",
    signedInEyebrow: "Sesión iniciada",
    /** Lo que se enseña cuando el proveedor de cuentas no da correo. */
    noEmail: "Tu cuenta",
    /** Nombre accesible del botón que abre el menú de cuenta. */
    accountLabel: (email: string): string => `Cuenta de ${email}`,
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    signingOut: "Cerrando sesión…",
    /** Aviso tras cerrar sesión (`useSignOut`). */
    signedOutNotice: "Sesión cerrada",
  },

  /** Carga de una ruta perezosa (`RouteSkeleton`). */
  routeLoading: "Cargando la pantalla",

  /** Pantalla que falla al descargarse o al pintarse (`RouteErrorBoundary`). */
  routeError: {
    downloadTitle: "No se pudo cargar esta pantalla",
    downloadMessage: `No se pudo descargar el código de la pantalla: puede que no haya conexión o que haya una versión nueva de la app. ${ROUTE_ERROR_ADVICE}`,
    crashTitle: "Esta pantalla ha fallado",
    /** Lo que se pone cuando el error llega sin mensaje. */
    unexpected: "Error inesperado.",
    /** El mensaje del error (o «Error inesperado.») y la coletilla. */
    crashMessage: (errorMessage: string): string =>
      `${errorMessage || "Error inesperado."} ${ROUTE_ERROR_ADVICE}`,
  },

  /** Página 404: la descripción va partida por la ruta que no existe. */
  notFound: {
    title: "Esta página no existe",
    descriptionBeforePath: "No hay nada en ",
    descriptionAfterPath: ". Puede que el enlace esté mal escrito o que la página se haya movido.",
    backToPanel: "Volver al panel",
    seeMarkets: "Ver mercados",
  },
} as const;
