
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, StarOff, Search, TrendingUp, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Watchlist = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [watchlistItems, setWatchlistItems] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem('crypto-watchlist') || '[]')
    setWatchlistItems(savedWatchlist)
  }, [])

  const toggleFavorite = (id: number) => {
    const updatedItems = watchlistItems.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    )
    setWatchlistItems(updatedItems)
    localStorage.setItem('crypto-watchlist', JSON.stringify(updatedItems))
    
    const item = updatedItems.find(item => item.id === id)
    toast({
      title: item?.isFavorite ? "Marcado como favorito" : "Desmarcado como favorito",
      description: `${item?.name} ${item?.isFavorite ? 'agregado a' : 'removido de'} favoritos`,
    })
  }

  const removeFromWatchlist = (id: number) => {
    const updatedItems = watchlistItems.filter(item => item.id !== id)
    setWatchlistItems(updatedItems)
    localStorage.setItem('crypto-watchlist', JSON.stringify(updatedItems))
    
    toast({
      title: "Eliminado del Watchlist",
      description: "La criptomoneda ha sido eliminada de tu watchlist",
    })
  }

  const filteredItems = watchlistItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const favoriteItems = filteredItems.filter(item => item.isFavorite)
  const otherItems = filteredItems.filter(item => !item.isFavorite)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Watchlist</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Sigue tus criptomonedas favoritas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
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

      {watchlistItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Tu watchlist está vacío</p>
            <p className="text-sm text-muted-foreground">Agrega criptomonedas desde la página de Mercados para empezar a seguir sus precios</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {favoriteItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  Favoritos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {favoriteItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                          {item.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{item.symbol}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base">${item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-1">
                            {item.change > 0 ? (
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            )}
                            <Badge variant={item.change > 0 ? "default" : "destructive"} className="text-xs">
                              {item.change > 0 ? '+' : ''}{item.change}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(item.id)}
                            className="text-yellow-500 hover:text-yellow-600 h-8 w-8"
                          >
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWatchlist(item.id)}
                            className="text-red-500 hover:text-red-600 text-xs px-2"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {otherItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Todas las Criptomonedas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {otherItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                          {item.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{item.symbol}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base">${item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-1">
                            {item.change > 0 ? (
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            )}
                            <Badge variant={item.change > 0 ? "default" : "destructive"} className="text-xs">
                              {item.change > 0 ? '+' : ''}{item.change}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(item.id)}
                            className="text-muted-foreground hover:text-yellow-500 h-8 w-8"
                          >
                            <StarOff className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWatchlist(item.id)}
                            className="text-red-500 hover:text-red-600 text-xs px-2"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default Watchlist
