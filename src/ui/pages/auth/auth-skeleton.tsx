import { AUTH_CARD_TEXT, AUTH_CHECKING_LABEL } from "@/application/auth-screen/presentation/texts";
import { LoadingRegion, Skeleton } from "@/ui/shared";

/**
 * Esqueleto con la forma del contenido de la tarjeta de acceso: cabecera, pestañas,
 * dos campos (con el hueco reservado de su error) y botón. Va dentro de `AuthFrame`.
 * Lleva el título de la pantalla como `h1` solo para lectores: el visible llega con la tarjeta.
 */
export function AuthSkeleton() {
  return (
    <>
      <h1 className="sr-only">{AUTH_CARD_TEXT.title}</h1>
      <LoadingRegion label={AUTH_CHECKING_LABEL}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="size-11 rounded-full" />
            <Skeleton className="h-8 w-52 max-w-full" />
            {/* En móvil la descripción ocupa dos líneas. */}
            <Skeleton className="h-10 w-64 max-w-full sm:h-5" />
          </div>
          <div className="flex flex-col gap-5">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="mb-5.5 h-11 w-full" />
              <Skeleton className="mb-5.5 h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
      </LoadingRegion>
    </>
  );
}
