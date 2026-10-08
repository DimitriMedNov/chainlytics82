/** Error del servicio de precios, con mensaje ya en español, listo para enseñar. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Error al leer o guardar los datos del usuario (watchlist, movimientos). */
export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepositoryError";
  }
}
