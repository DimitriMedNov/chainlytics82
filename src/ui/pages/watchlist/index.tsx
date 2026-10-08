import { UnderConstruction } from "@/ui/shared/under-construction";

/**
 * MARCADOR de la pantalla. Su agente sustituye este archivo (export por defecto
 * obligatorio: el armazón lo carga desde `src/ui/shell/routes.tsx`) y añade los
 * suyos al lado. El título y la descripción de aquí son provisionales.
 */
export default function WatchlistPage() {
  return (
    <UnderConstruction
      title="Watchlist"
      description="Las monedas que sigues"
      file="src/ui/pages/watchlist/index.tsx"
    />
  );
}
