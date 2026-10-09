import { useCallback, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthTab } from "@/domain/auth-screen/form";
import { useAuthScreen, type AuthScreen } from "@/hooks/auth-screen/useAuthScreen";
import { notify } from "@/ui/shared";

export interface AuthForm extends AuthScreen {
  /**
   * Último error que devolvió el envío y que no pertenece a un campo (lo dice
   * el servicio de cuentas). Se queda a la vista en el formulario porque el
   * aviso flotante desaparece solo. `null` si no hay.
   */
  serviceError: string | null;
  /** Cambia de pestaña a partir del `string` que entrega el componente de pestañas. */
  changeTab(value: string): void;
  /** `onSubmit` del formulario: envía, lanza el aviso y navega si toca. */
  handleSubmit(event: FormEvent<HTMLFormElement>): void;
}

/**
 * Une el contenedor de la pantalla (`useAuthScreen`) con lo que solo sabe la
 * interfaz: lanzar el aviso, navegar y recordar el último error del servicio.
 */
export function useAuthForm(): AuthForm {
  const screen = useAuthScreen();
  const navigate = useNavigate();
  const [lastError, setLastError] = useState<string | null>(null);

  const { setTab, setEmail: setScreenEmail, setPassword: setScreenPassword, submit } = screen;

  const changeTab = useCallback(
    (value: string) => {
      if (!isAuthTab(value)) return;
      setLastError(null);
      setTab(value);
    },
    [setTab],
  );

  const setEmail = useCallback(
    (value: string) => {
      setLastError(null);
      setScreenEmail(value);
    },
    [setScreenEmail],
  );

  const setPassword = useCallback(
    (value: string) => {
      setLastError(null);
      setScreenPassword(value);
    },
    [setScreenPassword],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLastError(null);
      void submit().then(({ notice, navigateTo }) => {
        if (notice.kind === "success") {
          notify.success(notice.text);
        } else {
          notify.error(notice.text);
          setLastError(notice.text);
        }
        if (navigateTo !== null) navigate(navigateTo, { replace: true });
      });
    },
    [submit, navigate],
  );

  // Si el error es de un campo ya sale debajo de ese campo: no se repite.
  const hasFieldError = screen.fieldErrors.email !== null || screen.fieldErrors.password !== null;

  return {
    ...screen,
    setEmail,
    setPassword,
    serviceError: hasFieldError ? null : lastError,
    changeTab,
    handleSubmit,
  };
}
