
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, DollarSign } from "lucide-react"

interface CryptoDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coin: {
    rank: number
    name: string
    symbol: string
    price: number
    change: number
    marketCap: number
    volume: number
    category: string
  } | null
}

const CryptoDetailsModal = ({ open, onOpenChange, coin }: CryptoDetailsModalProps) => {
  if (!coin) return null

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {coin.symbol.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{coin.name}</h2>
              <p className="text-muted-foreground">{coin.symbol}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Precio Actual</p>
              <p className="text-3xl font-bold">${coin.price.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Cambio 24h</p>
              <div className="flex items-center gap-2">
                {coin.change > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={coin.change > 0 ? "default" : "destructive"} className="text-lg">
                  {coin.change > 0 ? '+' : ''}{coin.change}%
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <p className="font-semibold">Market Cap</p>
              </div>
              <p className="text-2xl font-bold">{formatNumber(coin.marketCap)}</p>
              <p className="text-sm text-muted-foreground">Ranking #{coin.rank}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <p className="font-semibold">Volumen 24h</p>
              </div>
              <p className="text-2xl font-bold">{formatNumber(coin.volume)}</p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Información Adicional</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoría:</span>
                <Badge variant="outline" className="capitalize">{coin.category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Símbolo:</span>
                <span className="font-medium">{coin.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ranking Global:</span>
                <span className="font-medium">#{coin.rank}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CryptoDetailsModal
