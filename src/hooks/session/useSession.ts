import { useContext } from "react";
import { SessionContext, type SessionValue } from "@/hooks/session/SessionContext";

/** Sesión, estado del servicio de cuentas y estado de acceso ya decidido. */
export function useSession(): SessionValue {
  return useContext(SessionContext);
}
