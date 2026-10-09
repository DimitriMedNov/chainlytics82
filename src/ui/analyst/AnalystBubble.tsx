import type { ReactNode } from "react";
import { Bot, User } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { AnalystMessage } from "@/domain/analyst/message";

type Role = AnalystMessage["role"];

const rowVariants = cva("flex min-w-0 items-start gap-2", {
  variants: { role: { user: "flex-row-reverse pl-8", assistant: "pr-8" } },
});

const avatarVariants = cva("flex size-8 shrink-0 items-center justify-center rounded-full", {
  variants: { role: { user: "bg-primary text-primary-foreground", assistant: "bg-muted text-foreground" } },
});

const bubbleVariants = cva("min-w-0 break-words rounded-lg px-3 py-2 text-sm", {
  variants: { role: { user: "bg-primary text-primary-foreground", assistant: "bg-muted text-foreground" } },
});

export interface AnalystBubbleProps {
  role: Role;
  children: ReactNode;
  className?: string;
}

/** Fila de conversación: avatar + burbuja. Usuario a la derecha, asistente a la izquierda. */
export function AnalystBubble({ role, children, className }: AnalystBubbleProps) {
  const Icon = role === "user" ? User : Bot;

  return (
    <div data-slot="analyst-message" data-role={role} className={rowVariants({ role })}>
      <span className={avatarVariants({ role })}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className={cn(bubbleVariants({ role }), className)}>{children}</div>
    </div>
  );
}
