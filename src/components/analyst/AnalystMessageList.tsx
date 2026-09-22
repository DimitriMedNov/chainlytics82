import ReactMarkdown from "react-markdown";
import { Bot, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalystMessage } from "@/lib/analystStream";

export interface AnalystMessageListProps {
  messages: AnalystMessage[];
  loading: boolean;
}

function BotAvatar() {
  return (
    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
      <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
    </div>
  );
}

/** Burbujas del chat, y el aviso de "analizando" mientras no llega el primer trozo. */
export default function AnalystMessageList({ messages, loading }: AnalystMessageListProps) {
  const esperandoPrimerTrozo = loading && messages[messages.length - 1]?.role === "user";

  return (
    <>
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
        >
          {m.role === "assistant" && <BotAvatar />}
          <div
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-sm",
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            {m.role === "assistant" ? (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:my-2 prose-p:my-1 prose-ol:my-1 prose-ul:my-1">
                <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{m.content}</p>
            )}
          </div>
          {m.role === "user" && (
            <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
              <User className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
        </div>
      ))}

      {esperandoPrimerTrozo && (
        <div className="flex gap-2" role="status">
          <BotAvatar />
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">Analizando...</span>
          </div>
        </div>
      )}
    </>
  );
}
