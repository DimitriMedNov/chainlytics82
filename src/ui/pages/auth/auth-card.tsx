import { useId } from "react";
import { CircleAlert, Lock, Mail, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  AUTH_CARD_TEXT,
  AUTH_FIELD_TEXT,
  AUTH_TAB_TEXT,
} from "@/application/auth-screen/presentation/texts";
import { AUTH_TABS } from "@/domain/auth-screen/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/animate-ui/components/radix/tabs";
import { AuthField } from "@/ui/pages/auth/auth-field";
import {
  ERROR_EXIT,
  FADE_HIDDEN,
  FADE_TRANSITION,
  FADE_VISIBLE,
  SHIFT_TRANSITION,
  useAuthMotion,
} from "@/ui/pages/auth/auth-motion";
import { AuthSubmitButton } from "@/ui/pages/auth/auth-submit-button";
import type { AuthForm } from "@/ui/pages/auth/use-auth-form";

export interface AuthCardProps {
  form: AuthForm;
}

/**
 * Contenido de la tarjeta de acceso: cabecera, pestañas «Iniciar sesión» /
 * «Crear cuenta» y el formulario. Va dentro de `AuthFrame` y entra con un fundido.
 */
export function AuthCard({ form }: AuthCardProps) {
  const titleId = useId();
  const serviceErrorId = useId();
  const { tab, busy, fieldErrors, serviceError } = form;
  const authMotion = useAuthMotion();

  return (
    <motion.div
      data-slot="auth-card"
      layout={authMotion.layoutPosition}
      initial={FADE_HIDDEN}
      animate={FADE_VISIBLE}
      transition={FADE_TRANSITION}
      className="flex flex-col gap-6"
    >
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <motion.span
            className="flex"
            initial={authMotion.iconHidden}
            animate={authMotion.iconVisible}
            transition={authMotion.iconTransition}
          >
            <Sparkles className="size-5" aria-hidden="true" />
          </motion.span>
        </span>
        <h1 id={titleId} className="type-title text-balance text-foreground">
          {AUTH_CARD_TEXT.title}
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">{AUTH_CARD_TEXT.description}</p>
      </header>

      <Tabs value={tab} onValueChange={form.changeTab} className="gap-5">
        <TabsList aria-labelledby={titleId} className="h-auto w-full">
          {AUTH_TABS.map((value) => (
            <TabsTrigger key={value} value={value} className="min-h-11">
              {AUTH_TAB_TEXT[value].label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Un solo panel para las dos pestañas: correo y contraseña se comparten. */}
        <TabsContent value={tab} initial={false}>
          <form
            onSubmit={form.handleSubmit}
            aria-describedby={serviceError !== null ? serviceErrorId : undefined}
            className="flex flex-col gap-2"
          >
            <AuthField
              label={AUTH_FIELD_TEXT.email.label}
              type={AUTH_FIELD_TEXT.email.inputType}
              icon={Mail}
              value={form.email}
              onValueChange={form.setEmail}
              error={fieldErrors.email}
              autoComplete="email"
              required
            />
            <AuthField
              label={AUTH_FIELD_TEXT.password.label}
              type={AUTH_FIELD_TEXT.password.inputType}
              icon={Lock}
              value={form.password}
              onValueChange={form.setPassword}
              error={fieldErrors.password}
              autoComplete={tab === "signin" ? "current-password" : "new-password"}
              required
            />

            <AnimatePresence initial={false}>
              {serviceError !== null ? (
                <motion.p
                  key="service-error"
                  id={serviceErrorId}
                  data-slot="auth-service-error"
                  layout={authMotion.layoutPosition}
                  initial={authMotion.errorHidden}
                  animate={authMotion.errorVisible}
                  exit={ERROR_EXIT}
                  transition={FADE_TRANSITION}
                  className="mb-2 flex items-start gap-2 rounded-md border border-destructive/40 bg-elevated p-3 text-sm text-foreground"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                  <span className="min-w-0 break-words">{serviceError}</span>
                </motion.p>
              ) : null}
            </AnimatePresence>

            {/* Ni el error del servicio ni un error de campo de dos líneas empujan el botón de golpe: se recoloca con `transform` (con «reducir movimiento», por el flujo normal). */}
            <motion.div layout={authMotion.layoutPosition} transition={SHIFT_TRANSITION}>
              <AuthSubmitButton label={AUTH_TAB_TEXT[tab].submit} labelKey={tab} busy={busy} />
            </motion.div>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
