
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, StarOff, Search, TrendingUp, TrendingDown } from "lucide-react"

const Watchlist = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [watchlistItems, setWatchlistItems] = useState([
    { id: 1, name: "Bitcoin", symbol: "BTC", price: 45000, change: 2.5, isFavorite: true },
    { id: 2, name: "Ethereum", symbol: "ETH", price: 3200, change: -1.2, isFavorite: true },
    { id: 3, name: "Cardano", symbol: "ADA", price: 0.45, change: 5.8, isFavorite: true },
    { id: 4, name: "Solana", symbol: "SOL", price: 95, change: 3.2, isFavorite: false },
    { id: 5, name: "Polygon", symbol: "MATIC", price: 0.85, change: -2.1, isFavorite: false },
  ])

  const toggleFavorite = (id: number) => {
    setWatchlistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    )
  }

  const filteredItems = watchlistItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const favoriteItems = filteredItems.filter(item => item.isFavorite)
  const otherItems = filteredItems.filter(item => !item.isFavorite)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Watchlist</h1>
        <p className="text-muted-foreground">Sigue tus criptomonedas favoritas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Criptomonedas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nombre o símbolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {favoriteItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Favoritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {favoriteItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {item.symbol.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        {item.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <Badge variant={item.change > 0 ? "default" : "destructive"}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(item.id)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Todas las Criptomonedas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {otherItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.symbol.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">${item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      {item.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant={item.change > 0 ? "default" : "destructive"}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(item.id)}
                    className="text-muted-foreground hover:text-yellow-500"
                  >
                    <StarOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Watchlist
