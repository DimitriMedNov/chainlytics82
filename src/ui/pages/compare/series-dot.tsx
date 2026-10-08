import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { seriesBgClass } from "@/ui/pages/compare/constants";

const seriesDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: { size: { sm: "size-2.5", md: "size-3" } },
  defaultVariants: { size: "sm" },
});

export interface SeriesDotProps extends VariantProps<typeof seriesDotVariants> {
  /** 1..5 (token `--chart-N`), o `null` si la moneda no tiene línea. */
  colorIndex: number | null;
  className?: string;
}

/** Punto del color de la línea de una moneda. Decorativo: siempre va junto a su nombre. */
export function SeriesDot({ colorIndex, size, className }: SeriesDotProps) {
  return (
    <span
      aria-hidden="true"
      data-slot="series-dot"
      className={cn(seriesDotVariants({ size }), seriesBgClass(colorIndex), className)}
    />
  );
}
