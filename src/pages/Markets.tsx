
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

const Markets = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("marketcap")
  const [category, setCategory] = useState("all")

  const marketsData = [
    { rank: 1, name: "Bitcoin", symbol: "BTC", price: 45000, change: 2.5, marketCap: 875000000000, volume: 28500000000, category: "currency" },
    { rank: 2, name: "Ethereum", symbol: "ETH", price: 3200, change: -1.2, marketCap: 385000000000, volume: 15800000000, category: "platform" },
    { rank: 3, name: "Cardano", symbol: "ADA", price: 0.45, change: 5.8, marketCap: 15000000000, volume: 850000000, category: "platform" },
    { rank: 4, name: "Solana", symbol: "SOL", price: 95, change: 3.2, marketCap: 42000000000, volume: 2100000000, category: "platform" },
    { rank: 5, name: "Polygon", symbol: "MATIC", price: 0.85, change: -2.1, marketCap: 8500000000, volume: 420000000, category: "platform" },
    { rank: 6, name: "Chainlink", symbol: "LINK", price: 14.5, change: 1.8, marketCap: 7200000000, volume: 380000000, category: "oracle" },
    { rank: 7, name: "Dogecoin", symbol: "DOGE", price: 0.08, change: 8.5, marketCap: 11500000000, volume: 1200000000, category: "meme" },
    { rank: 8, name: "Avalanche", symbol: "AVAX", price: 32, change: -0.5, marketCap: 12000000000, volume: 680000000, category: "platform" },
  ]

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "currency", label: "Monedas" },
    { value: "platform", label: "Plataformas" },
    { value: "oracle", label: "Oráculos" },
    { value: "meme", label: "Meme Coins" },
  ]

  const filteredData = marketsData
    .filter(item => 
      (category === "all" || item.category === category) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "marketcap": return b.marketCap - a.marketCap
        case "volume": return b.volume - a.volume
        case "change": return b.change - a.change
        case "price": return b.price - a.price
        default: return a.rank - b.rank
      }
    })

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mercados</h1>
        <p className="text-muted-foreground">Explora todas las criptomonedas del mercado</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar criptomoneda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketcap">Market Cap</SelectItem>
                <SelectItem value="volume">Volumen 24h</SelectItem>
                <SelectItem value="change">Cambio 24h</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Criptomonedas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                    #{coin.rank}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {coin.symbol.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{coin.name}</h3>
                    <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                  </div>
                </div>
                
                <div className="hidden md:block text-right">
                  <p className="font-semibold">${coin.price.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    {coin.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <Badge variant={coin.change > 0 ? "default" : "destructive"}>
                      {coin.change > 0 ? '+' : ''}{coin.change}%
                    </Badge>
                  </div>
                </div>

                <div className="hidden lg:block text-right">
                  <p className="font-semibold">{formatNumber(coin.marketCap)}</p>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                </div>

                <div className="hidden lg:block text-right">
                  <p className="font-semibold">{formatNumber(coin.volume)}</p>
                  <p className="text-sm text-muted-foreground">Vol 24h</p>
                </div>

                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Markets
