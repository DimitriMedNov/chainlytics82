
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

interface WatchlistHeaderProps {
  itemCount: number
  onSort: () => void
}

const WatchlistHeader = ({ itemCount, onSort }: WatchlistHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Mi Watchlist</h1>
          <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
            Sigue tus criptomonedas favoritas • {itemCount} monedas
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onSort}
            className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
          >
            <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
            Ordenar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WatchlistHeader
