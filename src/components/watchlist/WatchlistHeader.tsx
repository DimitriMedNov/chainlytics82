
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

interface WatchlistHeaderProps {
  itemCount: number
  onSort: () => void
}

const WatchlistHeader = ({ itemCount, onSort }: WatchlistHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mi Watchlist</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Sigue tus criptomonedas favoritas • {itemCount} monedas
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSort}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Ordenar
        </Button>
      </div>
    </div>
  )
}

export default WatchlistHeader
