import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import type { Convertible } from "@/hooks/useConvertibles";

export interface QuickConversionsProps {
  options: Convertible[];
  isPending: boolean;
}

/** Equivalencias calculadas con el precio real, no escritas a mano. */
const ATAJOS: ReadonlyArray<{ code: string; amount: number }> = [
  { code: "BTC", amount: 1 },
  { code: "ETH", amount: 1 },
  { code: "SOL", amount: 10 },
  { code: "ADA", amount: 1000 },
];

const QuickConversions = ({ options, isPending }: QuickConversionsProps) => {
  const rows = ATAJOS.flatMap(({ code, amount }) => {
    const option = options.find((item) => item.code === code);
    return option ? [{ code, amount, name: option.name, value: option.usdPrice * amount }] : [];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversiones rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-3" aria-busy="true">
            {ATAJOS.map((item) => (
              <Skeleton key={item.code} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.code}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {row.amount} {row.code}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{row.name} a dólares</p>
                </div>
                <p className="font-semibold">{formatCurrency(row.value)}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickConversions;
