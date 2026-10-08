import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { motion } from "motion/react";
import type { TopCoinRow } from "@/application/panel/presentation/topCoinRows";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/ui/base/table";
import { fadeInStaggered } from "@/ui/pages/panel/motion/presets";
import { TrendLabel } from "@/ui/pages/panel/trend-label";
import { CoinAvatar } from "@/ui/shared";

export interface TopCoinsTableProps {
  /** Filas ya formateadas (`useTopCoins().rows`). */
  rows: readonly TopCoinRow[];
  /** Abre el detalle de la moneda con ese id. */
  onSelect: (coinId: string) => void;
}

/** La fila base de la tabla como componente de Motion (pasa `ref` y `style` a su `<tr>`). */
const MotionRow = motion.create(TableRow);

const HEAD = "type-eyebrow h-10 px-4 text-muted-foreground sm:px-5";
const CELL = "type-num px-4 py-2 text-right sm:px-5";

/**
 * Tabla del top 5 (funciones 14 a 19). El ancho mínimo (480 px) hace que en
 * móvil se desplace dentro de su caja, sin desbordar la página. Las filas entran
 * con un fundido escalonado al montarse; como su `key` es el id de la moneda,
 * el refresco de cada minuto no repite la entrada.
 */
export function TopCoinsTable({ rows, onSelect }: TopCoinsTableProps) {
  const { columns } = PANEL_TEXTS.top;

  return (
    <Table className="min-w-120">
      <TableCaption className="sr-only">{PANEL_TEXTS.top.caption}</TableCaption>
      <TableHeader className="bg-elevated">
        <TableRow className="hover:bg-transparent">
          <TableHead scope="col" className={HEAD}>
            {columns.name}
          </TableHead>
          <TableHead scope="col" className={cn(HEAD, "text-right")}>
            {columns.price}
          </TableHead>
          <TableHead scope="col" className={cn(HEAD, "text-right")}>
            {columns.change}
          </TableHead>
          <TableHead scope="col" className={cn(HEAD, "text-right")}>
            {columns.volume}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <MotionRow
            key={row.id}
            data-slot="top-coin-row"
            className="hover:bg-accent/60"
            {...fadeInStaggered(index)}
          >
            <TableHead scope="row" className="h-auto px-2 py-1 font-normal sm:px-3">
              <button
                type="button"
                onClick={() => onSelect(row.id)}
                aria-label={PANEL_TEXTS.top.seeDetail(row.name)}
                className="flex min-h-11 w-full items-center gap-3 rounded-md px-2 text-left"
              >
                <CoinAvatar src={row.image} symbol={row.symbol} size="md" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">{row.name}</span>
                  <span className="text-xs uppercase text-muted-foreground">{row.symbol}</span>
                </span>
              </button>
            </TableHead>
            <TableCell className={cn(CELL, "font-medium text-foreground")}>{row.price}</TableCell>
            <TableCell className={CELL}>
              <TrendLabel text={row.change} rising={row.rising} size="md" />
            </TableCell>
            <TableCell className={cn(CELL, "text-muted-foreground")}>{row.volume}</TableCell>
          </MotionRow>
        ))}
      </TableBody>
    </Table>
  );
}
