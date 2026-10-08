import { useCallback, useMemo, useState } from "react";
import { validateAuthFields } from "@/application/auth-screen/fieldErrors";
import { authSubmitOutcome } from "@/application/auth-screen/submitOutcome";
import {
  DEFAULT_AUTH_TAB,
  NO_FIELD_ERRORS,
  type AuthFieldErrors,
  type AuthSubmitOutcome,
  type AuthTab,
} from "@/domain/auth-screen/form";
import {
  authRedirectTarget,
  resolveAuthScreenMode,
  type AuthScreenMode,
} from "@/domain/auth-screen/mode";
import { useCredentialsAuth } from "@/hooks/session/useCredentialsAuth";
import { useSession } from "@/hooks/session/useSession";

export interface AuthScreen {
  /** Qué pintar: esqueleto, aviso de servicio caído, nada (redirigir) o el formulario. */
  mode: AuthScreenMode;
  /** Única señal de redirección: ruta a la que ir con `replace`, o `null`. */
  redirectTo: string | null;
  /** Pestaña activa. Empieza en "signin". */
  tab: AuthTab;
  setTab(tab: AuthTab): void;
  email: string;
  password: string;
  setEmail(value: string): void;
  setPassword(value: string): void;
  /** Error de validación de cada campo tras el último envío; `null` si vale. */
  fieldErrors: AuthFieldErrors;
  /** true mientras se espera al servicio de cuentas: deshabilita el botón. */
  busy: boolean;
  /** Envía la pestaña activa. Devuelve el aviso que hay que lanzar y si se navega. */
  submit(): Promise<AuthSubmitOutcome>;
}

/**
 * Contenedor de la pantalla de acceso (/auth). No lanza avisos ni navega: le
 * dice a la interfaz qué aviso lanzar y a dónde ir.
 */
export function useAuthScreen(): AuthScreen {
  const { access } = useSession();
  const { signIn, signUp, busy } = useCredentialsAuth();

  const [tab, setTab] = useState<AuthTab>(DEFAULT_AUTH_TAB);
  // Conservado: correo y contraseña son los mismos en las dos pestañas; lo
  // escrito en una aparece en la otra (inventario §9, punto 12).
  const [email, setEmailValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>(NO_FIELD_ERRORS);

  const mode = useMemo(() => resolveAuthScreenMode(access), [access]);

  const setEmail = useCallback((value: string) => {
    setEmailValue(value);
    setFieldErrors((errors) => (errors.email === null ? errors : { ...errors, email: null }));
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordValue(value);
    setFieldErrors((errors) => (errors.password === null ? errors : { ...errors, password: null }));
  }, []);

  const submit = useCallback(async () => {
    setFieldErrors(validateAuthFields(email, password));
    // `signIn` y `signUp` vuelven a validar: si lo escrito no vale devuelven el
    // primer mensaje (correo antes que contraseña) sin llamar al servicio.
    const result = await (tab === "signin" ? signIn(email, password) : signUp(email, password));
    return authSubmitOutcome(tab, result);
  }, [tab, email, password, signIn, signUp]);

  return {
    mode,
    redirectTo: authRedirectTarget(mode),
    tab,
    setTab,
    email,
    password,
    setEmail,
    setPassword,
    fieldErrors,
    busy,
    submit,
  };
}
