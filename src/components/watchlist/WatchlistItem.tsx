
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
    ? "bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-lg"
    : "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 shadow-lg"

  const hoverClass = isFavorite 
    ? "hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-950/50 dark:hover:to-orange-950/30"
    : "hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30"

  return (
    <div className={`flex items-center justify-between p-4 sm:p-5 lg:p-6 border rounded-2xl ${hoverClass} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${gradientClass} rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg flex-shrink-0`}>
          {item.symbol.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-base sm:text-lg lg:text-xl truncate text-gray-900 dark:text-gray-100">{item.name}</h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-semibold">{item.symbol}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        <div className="text-right">
          <p className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 dark:text-gray-100">{formatCurrency(item.price)}</p>
          <div className="flex items-center gap-1 justify-end">
            {item.change > 0 ? (
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            )}
            <Badge 
              variant={item.change > 0 ? "default" : "destructive"} 
              className={`text-xs sm:text-sm font-semibold px-2 py-1 ${
                item.change > 0 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
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
            className={`h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl hover:scale-110 transition-all duration-200 ${
              item.isFavorite 
                ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" 
                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
            }`}
          >
            {item.isFavorite ? (
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
            ) : (
              <StarOff className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(item)
            }}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl hover:scale-110 transition-all duration-200"
          >
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onTrade(item)
            }}
            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl hover:scale-110 transition-all duration-200"
          >
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(item.id)
            }}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl hover:scale-110 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WatchlistItem
