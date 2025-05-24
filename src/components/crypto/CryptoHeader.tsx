
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink } from "lucide-react"

interface CryptoHeaderProps {
  coin: {
    rank: number
    name: string
    symbol: string
  }
  isInWatchlist: boolean
  onToggleWatchlist: () => void
  onExchange: () => void
}

const CryptoHeader = ({ coin, isInWatchlist, onToggleWatchlist, onExchange }: CryptoHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 via-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-2xl shadow-lg flex-shrink-0">
          {coin.symbol.charAt(0)}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-3xl font-bold text-foreground truncate">{coin.name}</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm sm:text-lg text-muted-foreground font-medium">{coin.symbol}</p>
            <Badge variant="outline" className="text-xs sm:text-sm">#{coin.rank}</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant={isInWatchlist ? "default" : "outline"}
          size="sm"
          onClick={onToggleWatchlist}
          className="flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-3"
        >
          <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">{isInWatchlist ? 'En Watchlist' : 'Agregar a Watchlist'}</span>
          <span className="sm:hidden">{isInWatchlist ? 'En Lista' : 'Agregar'}</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExchange}
          className="flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-3"
        >
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Intercambiar</span>
          <span className="sm:hidden">Trade</span>
        </Button>
      </div>
    </div>
  )
}

export default CryptoHeader
