
import { BarChart3, DollarSign } from "lucide-react"

interface CryptoMarketStatsProps {
  coin: {
    marketCap: number
    volume: number
    rank: number
  }
  additionalData: {
    fdv: number
    circulatingSupply: number
    totalSupply: number
  }
}

const CryptoMarketStats = ({ coin, additionalData }: CryptoMarketStatsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
          <h3 className="text-sm sm:text-lg font-semibold">Capitalización de Mercado</h3>
        </div>
        <p className="text-xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">{formatNumber(coin.marketCap)}</p>
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cap. Totalmente Diluida:</span>
            <span className="font-medium">{formatNumber(additionalData.fdv)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ranking Global:</span>
            <span className="font-medium">#{coin.rank}</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
          <h3 className="text-sm sm:text-lg font-semibold">Volumen e Oferta</h3>
        </div>
        <p className="text-xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-2">{formatNumber(coin.volume)}</p>
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Oferta Circulante:</span>
            <span className="font-medium">{additionalData.circulatingSupply.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Oferta Total:</span>
            <span className="font-medium">{additionalData.totalSupply.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoMarketStats
