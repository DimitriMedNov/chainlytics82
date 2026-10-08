import { UnderConstruction } from "@/ui/shared/under-construction";

/**
 * MARCADOR de la pantalla. Su agente sustituye este archivo (export por defecto
 * obligatorio: el armazón lo carga desde `src/ui/shell/routes.tsx`) y añade los
 * suyos al lado. El título y la descripción de aquí son provisionales.
 */
export default function AuthPage() {
  return (
    <UnderConstruction
      title="Accede a Chainlytics"
      description="Inicia sesión o crea tu cuenta"
      file="src/ui/pages/auth/index.tsx"
    />
  );
}
