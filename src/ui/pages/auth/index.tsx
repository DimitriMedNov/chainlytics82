import { Navigate } from "react-router-dom";
import {
  AUTH_CARD_TEXT,
  AUTH_UNAVAILABLE_WHAT,
} from "@/application/auth-screen/presentation/texts";
import { AuthCard } from "@/ui/pages/auth/auth-card";
import { AuthFrame } from "@/ui/pages/auth/auth-frame";
import { AuthSkeleton } from "@/ui/pages/auth/auth-skeleton";
import { useAuthForm } from "@/ui/pages/auth/use-auth-form";
import { PageContainer, ServiceUnavailable } from "@/ui/shared";

/** Pantalla de acceso (/auth): esqueleto, aviso de servicio caído o tarjeta con el formulario. */
export default function AuthPage() {
  const form = useAuthForm();
  const { mode } = form;

  // Única redirección: con sesión no se pinta nada.
  if (form.redirectTo !== null) return <Navigate to={form.redirectTo} replace />;

  return (
    <PageContainer width="narrow" className="flex flex-col items-center py-8 lg:py-16">
      {/* Un solo marco para esqueleto y formulario: entra una vez y no salta al cambiar. */}
      {mode.kind === "checking" || mode.kind === "form" ? (
        <AuthFrame>{mode.kind === "checking" ? <AuthSkeleton /> : <AuthCard form={form} />}</AuthFrame>
      ) : null}
      {mode.kind === "unavailable" ? (
        <>
          <h1 className="sr-only">{AUTH_CARD_TEXT.title}</h1>
          <ServiceUnavailable reason={mode.reason} what={AUTH_UNAVAILABLE_WHAT} />
        </>
      ) : null}
    </PageContainer>
  );
}
