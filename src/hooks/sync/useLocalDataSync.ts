import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeps } from "@/app/deps";
import { useSession } from "@/hooks/session/useSession";

/**
 * Al iniciar sesión, sube a la cuenta lo que estuviera guardado solo en este
 * navegador (una vez por usuario y carga de página).
 *
 * `onMigrated` recibe cuántos elementos se movieron: quien llama enseña el
 * aviso (su texto sale de `migratedMessage`).
 */
export function useLocalDataSync(onMigrated?: (movidos: number) => void): void {
  const { sync } = useDeps();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const migratedFor = useRef<string | null>(null);

  // El aviso siempre usa la última función recibida, sin relanzar la subida.
  const notify = useRef(onMigrated);
  useEffect(() => {
    notify.current = onMigrated;
  }, [onMigrated]);

  useEffect(() => {
    const userId = user?.id;
    if (!userId || migratedFor.current === userId) return;
    migratedFor.current = userId;

    let cancelled = false;

    // El caso de uso lee y vacía lo local en esta misma llamada, antes de esperar nada.
    void sync.migrateLocalData(userId).then((movidos) => {
      if (cancelled || movidos === 0) return;

      void queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      void queryClient.invalidateQueries({ queryKey: ["portfolio-transactions", userId] });
      notify.current?.(movidos);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id, queryClient, sync]);
}
