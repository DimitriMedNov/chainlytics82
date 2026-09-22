import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import AnalystIntro from "@/components/analyst/AnalystIntro";
import AnalystMessageList from "@/components/analyst/AnalystMessageList";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalystChat } from "@/hooks/useAnalystChat";

export interface AnalystPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AnalystPanel({ open, onOpenChange }: AnalystPanelProps) {
  const { session, user, canSignIn, backend } = useAuth();
  const { messages, loading, send } = useAnalystChat();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ScrollArea desplaza su viewport interno, no la raíz: movemos un ancla del final.
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const submit = (text: string) => {
    if (send(text)) setInput("");
  };

  const intro = !session
    ? canSignIn
      ? "signin"
      : backend !== "checking"
        ? "unavailable"
        : null
    : messages.length === 0
      ? "welcome"
      : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
              <Sparkles className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="flex flex-col items-start">
              <span>CryptoSense AI</span>
              <Badge variant="secondary" className="px-1.5 py-0 text-xs font-normal">
                Tu analista crypto con IA
              </Badge>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {intro && (
              <AnalystIntro
                variant={intro}
                userName={user?.email?.split("@")[0]}
                onSuggestion={submit}
                onNavigate={() => onOpenChange(false)}
              />
            )}
            <AnalystMessageList messages={messages} loading={loading} />
            <div ref={endRef} aria-hidden="true" />
          </div>
        </ScrollArea>

        {session && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex gap-2 border-t p-4"
          >
            <Label htmlFor="analyst-input" className="sr-only">
              Tu pregunta
            </Label>
            <Input
              id="analyst-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre el mercado crypto..."
              disabled={loading}
              className="h-11"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              aria-label="Enviar pregunta"
              className="h-11 w-11 flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
