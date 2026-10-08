import { QueryClient } from "@tanstack/react-query";

/** Mismas opciones que tenía la app anterior. */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        // Sin esto, React Query PAUSA la consulta cuando cree que no hay red y
        // la pantalla se queda cargando para siempre, sin decir nada. Preferimos
        // que falle y que se vea el error con su botón de reintentar.
        networkMode: "always",
      },
      mutations: {
        networkMode: "always",
      },
    },
  });
}
