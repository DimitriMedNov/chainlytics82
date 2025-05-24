
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoPriceSectionProps {
  coin: {
    price: number
    change: number
  }
  additionalData: {
    high24h: number
    low24h: number
    ath: number
    atl: number
  }
}

const CryptoPriceSection = ({ coin, additionalData }: CryptoPriceSectionProps) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: num < 1 ? 4 : 2,
      maximumFractionDigits: num < 1 ? 4 : 2
    }).format(num)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-2 sm:space-y-3">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Precio Actual</p>
        <p className="text-2xl sm:text-4xl font-bold text-foreground">{formatCurrency(coin.price)}</p>
        <div className="flex items-center gap-2 sm:gap-3">
          {coin.change > 0 ? (
            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 sm:h-6 sm:w-6 text-red-500" />
          )}
          <Badge 
            variant={coin.change > 0 ? "default" : "destructive"} 
            className="text-sm sm:text-lg px-2 sm:px-3 py-1 font-semibold"
          >
            {coin.change > 0 ? '+' : ''}{coin.change.toFixed(2)}%
          </Badge>
          <span className="text-xs sm:text-sm text-muted-foreground">24h</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">Máximo 24h</p>
          <p className="text-sm sm:text-xl font-bold text-green-600">{formatCurrency(additionalData.high24h)}</p>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">Mínimo 24h</p>
          <p className="text-sm sm:text-xl font-bold text-red-600">{formatCurrency(additionalData.low24h)}</p>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">Máximo Histórico</p>
          <p className="text-sm sm:text-lg font-semibold text-amber-600">{formatCurrency(additionalData.ath)}</p>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">Mínimo Histórico</p>
          <p className="text-sm sm:text-lg font-semibold text-slate-600">{formatCurrency(additionalData.atl)}</p>
        </div>
      </div>
    </div>
  )
}

export default CryptoPriceSection
