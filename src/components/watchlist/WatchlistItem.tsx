
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, StarOff, TrendingUp, TrendingDown, Eye, ExternalLink, Trash2 } from "lucide-react"

interface WatchlistItemProps {
  item: {
    id: number
    name: string
    symbol: string
    price: number
    change: number
    isFavorite: boolean
  }
  onToggleFavorite: (id: number) => void
  onViewDetails: (item: any) => void
  onTrade: (item: any) => void
  onRemove: (id: number) => void
  isFavorite?: boolean
}

const WatchlistItem = ({ 
  item, 
  onToggleFavorite, 
  onViewDetails, 
  onTrade, 
  onRemove, 
  isFavorite = false 
}: WatchlistItemProps) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: num < 1 ? 4 : 2,
      maximumFractionDigits: num < 1 ? 4 : 2
    }).format(num)
  }

  const gradientClass = isFavorite 
    ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500"
    : "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600"

  const hoverClass = isFavorite 
    ? "hover:bg-background/50"
    : "hover:bg-muted/30"

  return (
    <div className={`flex items-center justify-between p-4 sm:p-6 border rounded-xl ${hoverClass} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${gradientClass} rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg`}>
          {item.symbol.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-sm sm:text-lg">{item.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">{item.symbol}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="text-right">
          <p className="font-bold text-sm sm:text-xl">{formatCurrency(item.price)}</p>
          <div className="flex items-center gap-1 justify-end">
            {item.change > 0 ? (
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            )}
            <Badge variant={item.change > 0 ? "default" : "destructive"} className="text-xs">
              {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(item.id)
            }}
            className={`h-8 w-8 sm:h-9 sm:w-9 ${
              item.isFavorite 
                ? "text-yellow-500 hover:text-yellow-600" 
                : "text-muted-foreground hover:text-yellow-500"
            }`}
          >
            {item.isFavorite ? (
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
            ) : (
              <StarOff className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(item)
            }}
            className="text-blue-500 hover:text-blue-600 h-8 w-8 sm:h-9 sm:w-9"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onTrade(item)
            }}
            className="text-green-500 hover:text-green-600 h-8 w-8 sm:h-9 sm:w-9"
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(item.id)
            }}
            className="text-red-500 hover:text-red-600 h-8 w-8 sm:h-9 sm:w-9"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WatchlistItem
