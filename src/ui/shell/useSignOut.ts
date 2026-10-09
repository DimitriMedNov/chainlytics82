import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SHELL_TEXTS } from "@/application/shared/presentation/texts";
import { useSession } from "@/hooks/session/useSession";
import { notify } from "@/ui/shared/notify";

export interface SignOutAction {
  signOut: () => Promise<void>;
  /** true mientras se espera al servicio. */
  isSigningOut: boolean;
}

/** Cerrar sesión como siempre: se cierra, sale el aviso «Sesión cerrada» y se va al panel. */
export function useSignOut(onDone?: () => void): SignOutAction {
  const { signOut: endSession } = useSession();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await endSession();
      notify.success(SHELL_TEXTS.session.signedOutNotice);
      onDone?.();
      navigate("/");
    } finally {
      setIsSigningOut(false);
    }
  }, [endSession, navigate, onDone]);

  return { signOut, isSigningOut };
}
