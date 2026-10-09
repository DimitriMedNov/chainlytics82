import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const coinAvatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-semibold uppercase text-muted-foreground",
  {
    variants: {
      size: {
        xs: "size-5 text-2xs",
        sm: "size-6 text-2xs",
        md: "size-8 text-xs",
        lg: "size-10 text-sm",
        /** 48 px: entre `lg` (40) y `xl` (56). El nombre dice la medida. */
        px48: "size-12 text-sm",
        xl: "size-14 text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const PIXELS = { xs: 20, sm: 24, md: 32, lg: 40, px48: 48, xl: 56 } as const;

export interface CoinAvatarProps extends VariantProps<typeof coinAvatarVariants> {
  /** URL de la imagen. Vacía o rota: se pinta la reserva con el símbolo. */
  src?: string | null;
  /** Símbolo de la moneda (BTC). Da las letras de la reserva. */
  symbol: string;
  /** Texto alternativo. Vacío por defecto: el nombre suele ir escrito al lado. */
  alt?: string;
  /** `true` solo en el primer pantallazo: carga sin esperar al scroll. */
  priority?: boolean;
  className?: string;
}

/** Logo de una moneda con tamaño fijo (no salta el layout) y reserva si la imagen falla. */
export function CoinAvatar({ src, symbol, alt = "", size, priority = false, className }: CoinAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const pixels = PIXELS[size ?? "md"];
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span className={cn(coinAvatarVariants({ size }), className)}>
      {showImage && src ? (
        <img
          src={src}
          alt={alt}
          width={pixels}
          height={pixels}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span aria-hidden={alt === "" ? "true" : undefined} role={alt === "" ? undefined : "img"} aria-label={alt || undefined}>
          {symbol.slice(0, 2)}
        </span>
      )}
    </span>
  );
}

export { coinAvatarVariants };
