import { useState } from "react";

/** `true` desde la primera vez que `condition` se cumple, y ya para siempre. */
export function useWasEver(condition: boolean): boolean {
  const [seen, setSeen] = useState(condition);
  if (condition && !seen) setSeen(true);
  return seen || condition;
}
