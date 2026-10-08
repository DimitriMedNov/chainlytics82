/**
 * Resultado de una acción que puede fallar por un motivo previsto (validación,
 * credenciales, servicio caído). En vez de lanzar una excepción, quien llama
 * recibe el éxito o el error tipado y decide qué pintar.
 *
 * Las lecturas que alimentan react-query siguen lanzando: react-query necesita
 * la excepción para pasar la consulta a su estado de error.
 */
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
