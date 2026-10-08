import { UnderConstruction } from "@/ui/shared/under-construction";

/**
 * MARCADOR de la pantalla. Su agente sustituye este archivo (export por defecto
 * obligatorio: el armazón lo carga desde `src/ui/shell/routes.tsx`) y añade los
 * suyos al lado. El título y la descripción de aquí son provisionales.
 */
export default function ConverterPage() {
  return (
    <UnderConstruction
      title="Convertidor"
      description="Convierte entre criptomonedas y divisas"
      file="src/ui/pages/converter/index.tsx"
    />
  );
}
