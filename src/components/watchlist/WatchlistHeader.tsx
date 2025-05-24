
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

interface WatchlistHeaderProps {
  itemCount: number
  onSort: () => void
}

const WatchlistHeader = ({ itemCount, onSort }: WatchlistHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Mi Watchlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg font-medium">
            Sigue tus criptomonedas favoritas • {itemCount} monedas
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onSort}
            className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 font-semibold"
          >
            <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5" />
            Ordenar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WatchlistHeader
