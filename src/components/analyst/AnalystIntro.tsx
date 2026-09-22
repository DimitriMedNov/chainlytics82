import { Link } from "react-router-dom";
import { Bot, CloudOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "¿Cómo está el mercado hoy?",
  "Analiza Bitcoin vs Ethereum",
  "¿Qué son los meme coins?",
  "Explícame el market cap",
];

export interface AnalystIntroProps {
  variant: "unavailable" | "signin" | "welcome";
  userName?: string;
  onSuggestion: (text: string) => void;
  onNavigate: () => void;
}

/** Lo que se ve antes del primer mensaje: sin servicio, sin sesión o bienvenida. */
export default function AnalystIntro({ variant, userName, onSuggestion, onNavigate }: AnalystIntroProps) {
  if (variant === "unavailable") {
    return (
      <div className="space-y-4 py-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <CloudOff className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">El analista no está disponible</h3>
          <p className="px-4 text-sm text-muted-foreground">
            Se ejecuta en el servidor, y ahora mismo el servicio no responde. Los precios de la
            app siguen funcionando.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "signin") {
    return (
      <div className="space-y-4 py-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <LogIn className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">Inicia sesión para continuar</h3>
          <p className="px-4 text-sm text-muted-foreground">
            El analista IA solo está disponible para usuarios autenticados.
          </p>
        </div>
        <Button asChild className="min-h-11" onClick={onNavigate}>
          <Link to="/auth">Iniciar sesión / Registrarse</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="py-6 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <h3 className="mb-1 font-semibold">Hola{userName ? `, ${userName}` : ""}</h3>
        <p className="text-sm text-muted-foreground">
          Pregúntame sobre el mercado, monedas específicas, tendencias o conceptos.
        </p>
      </div>
      <div className="grid gap-2">
        <p className="text-xs font-medium text-muted-foreground">Sugerencias:</p>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestion(s)}
            className="min-h-11 rounded-md border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
