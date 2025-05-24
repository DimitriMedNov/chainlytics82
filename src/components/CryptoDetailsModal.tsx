
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Heart, ExternalLink, Clock, TrendingUp as ChartIcon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useState, useEffect } from "react"

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

// Mock chart data - in a real app this would come from an API
const generateMockChartData = (symbol: string, currentPrice: number) => {
  const data = []
  const basePrice = currentPrice * 0.95
  for (let i = 0; i < 30; i++) {
    const variance = (Math.random() - 0.5) * 0.1
    const price = basePrice + (basePrice * variance) + (i * (currentPrice - basePrice) / 30)
    data.push({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      price: Math.round(price * 100) / 100
    })
  }
  return data
}

const CryptoDetailsModal = ({ open, onOpenChange, coin }: CryptoDetailsModalProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (coin && open) {
      setChartData(generateMockChartData(coin.symbol, coin.price))
      setLastUpdated(new Date())
    }
  }, [coin, open])

  if (!coin) return null

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: num < 1 ? 4 : 2,
      maximumFractionDigits: num < 1 ? 4 : 2
    }).format(num)
  }

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
  }

  // Mock additional data - in a real app this would come from the API
  const additionalData = {
    high24h: coin.price * 1.08,
    low24h: coin.price * 0.92,
    ath: coin.price * 3.2,
    atl: coin.price * 0.1,
    circulatingSupply: coin.symbol === 'BTC' ? 19800000 : 120000000,
    totalSupply: coin.symbol === 'BTC' ? 21000000 : 120000000,
    fdv: coin.marketCap * 1.15
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                onClick={toggleWatchlist}
                className="flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{isInWatchlist ? 'En Watchlist' : 'Agregar a Watchlist'}</span>
                <span className="sm:hidden">{isInWatchlist ? 'En Lista' : 'Agregar'}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Intercambiar</span>
                <span className="sm:hidden">Trade</span>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 sm:space-y-8">
          {/* Price Section */}
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

          {/* Price Chart */}
          <div className="p-3 sm:p-6 border rounded-xl bg-gradient-to-br from-background to-muted/20">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <ChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              <h3 className="text-sm sm:text-lg font-semibold">Gráfico de Precios (30 días)</h3>
            </div>
            <div className="h-[200px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: '8px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontSize: '12px' }}
                    itemStyle={{ color: "#8989DE", fontSize: '12px' }}
                    formatter={(value) => [formatCurrency(Number(value)), 'Precio']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#8989DE" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#8989DE" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Stats */}
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

          {/* Additional Info */}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CryptoDetailsModal
