import { ApiError } from "@/application/shared/errors";

/** Si CoinGecko está saturado la conexión puede quedarse colgada, y sin esto
 *  la pantalla se quedaría cargando para siempre. */
const TIMEOUT_MS = 12_000;

function withTimeout(signal: AbortSignal | undefined): {
  signal: AbortSignal;
  cleanup: () => void;
  timedOut: () => boolean;
} {
  const controller = new AbortController();
  let expired = false;

  const timer = window.setTimeout(() => {
    expired = true;
    controller.abort();
  }, TIMEOUT_MS);

  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  return {
    signal: controller.signal,
    timedOut: () => expired,
    cleanup: () => {
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    },
  };
}

export type GetJson = (path: string, signal?: AbortSignal) => Promise<unknown>;

/** Cliente GET contra `baseUrl`, con tope de tiempo y errores en español. */
export function createGetJson(baseUrl: string): GetJson {
  return async function getJson(path, signal) {
    const guard = withTimeout(signal);
    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, { signal: guard.signal });
    } catch {
      if (guard.timedOut()) {
        throw new ApiError(408, "El servicio de precios tardó demasiado en responder.");
      }
      throw new ApiError(
        0,
        "No se pudo contactar con el servicio de precios: puede que no haya conexión " +
          "o que CoinGecko esté limitando las peticiones. Espera un momento y reintenta.",
      );
    } finally {
      guard.cleanup();
    }

    if (response.status === 429 || response.status === 503) {
      throw new ApiError(
        response.status,
        "CoinGecko está limitando las peticiones desde esta red. Espera un minuto y reintenta.",
      );
    }
    if (!response.ok) {
      throw new ApiError(
        response.status,
        `El servicio de precios respondió con error ${response.status}.`,
      );
    }
    return response.json();
  };
}
