
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface CryptoAdditionalInfoProps {
  coin: {
    category: string
    symbol: string
  }
  lastUpdated: Date
}

const CryptoAdditionalInfo = ({ coin, lastUpdated }: CryptoAdditionalInfoProps) => {
  return (
    <div className="p-4 sm:p-6 bg-muted/50 rounded-xl border">
      <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Información Adicional</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs sm:text-sm">Categoría:</span>
            <Badge variant="outline" className="capitalize font-medium text-xs">{coin.category}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs sm:text-sm">Símbolo:</span>
            <span className="font-medium text-sm sm:text-lg">{coin.symbol}</span>
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs sm:text-sm">Última Actualización:</span>
            <div className="flex items-center gap-1 sm:gap-2 text-xs">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">{lastUpdated.toLocaleTimeString('es-ES')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs sm:text-sm">Estado:</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium text-xs">En vivo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoAdditionalInfo
