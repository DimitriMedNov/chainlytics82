/**
 * Comprobaciones de los textos compartidos y del armazón: los que se componen
 * con datos deben dar exactamente lo que la interfaz escribía a mano.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import { SEARCH_RETRYING } from "../../../search/messages.ts";
import { SHARED_TEXTS as S, SHELL_TEXTS as A, noDataLabel } from "../texts.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

// Lo que ya existía no cambia.
check("sin dato", S.noData, "Sin dato");
check("sin dato sin periodo", noDataLabel(), "Sin dato");
check("sin dato con periodo", noDataLabel("24 h"), "Sin dato 24 h");

// Piezas compartidas.
check("reintentando, igual que el del buscador", S.error.retrying, SEARCH_RETRYING);
check("título de error por defecto", S.error.defaultTitle, "No se pudieron cargar los datos");
check("error al guardar", S.saveStatus.error("sin conexión"), "No se pudo guardar: sin conexión");
check("cerrar aviso", S.toast.close, "Cerrar aviso");
check(
  "en construcción, con el archivo en medio",
  `${S.underConstruction.descriptionBeforeFile}src/ui/pages/x.tsx${S.underConstruction.descriptionAfterFile}`,
  "Esta pantalla del rediseño todavía no está escrita. Sustituye src/ui/pages/x.tsx.",
);

// Armazón.
check("cuenta con correo", A.session.accountLabel("ana@correo.es"), "Cuenta de ana@correo.es");
check("cuenta sin correo", A.session.accountLabel(A.session.noEmail), "Cuenta de Tu cuenta");
check("destinos de la barra", Object.values(A.nav.items), [
  "Panel",
  "Mercados",
  "Portfolio",
  "Comparar",
  "Watchlist",
  "Convertidor",
]);
check(
  "fallo al descargar la pantalla",
  A.routeError.downloadMessage,
  "No se pudo descargar el código de la pantalla: puede que no haya conexión o que haya una versión nueva de la app. Reintenta y, si sigue igual, recarga la página.",
);
check(
  "fallo al pintar, con mensaje",
  A.routeError.crashMessage("x is not a function"),
  "x is not a function Reintenta y, si sigue igual, recarga la página.",
);
check(
  "fallo al pintar, sin mensaje",
  A.routeError.crashMessage(""),
  "Error inesperado. Reintenta y, si sigue igual, recarga la página.",
);
check("fallo sin mensaje, texto suelto", A.routeError.unexpected, "Error inesperado.");
check(
  "404, con la ruta en medio",
  `${A.notFound.descriptionBeforePath}/nada${A.notFound.descriptionAfterPath}`,
  "No hay nada en /nada. Puede que el enlace esté mal escrito o que la página se haya movido.",
);
