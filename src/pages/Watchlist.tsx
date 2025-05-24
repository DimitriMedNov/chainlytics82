
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, StarOff, Search, TrendingUp, TrendingDown, Eye, ArrowUpDown, Trash2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

const Watchlist = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [watchlistItems, setWatchlistItems] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const { toast } = useToast()
  const navigate = useNavigate()

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
    const item = watchlistItems.find(item => item.id === id)
    const updatedItems = watchlistItems.filter(item => item.id !== id)
    setWatchlistItems(updatedItems)
    localStorage.setItem('crypto-watchlist', JSON.stringify(updatedItems))
    
    toast({
      title: "Eliminado del Watchlist",
      description: `${item?.name} ha sido eliminado de tu watchlist`,
    })
  }

  const handleSort = (field: 'name' | 'price' | 'change') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleViewDetails = (item: any) => {
    // In a real app, this would open the crypto details modal
    toast({
      title: "Ver Detalles",
      description: `Mostrando detalles de ${item.name}`,
    })
  }

  const handleTrade = (item: any) => {
    navigate('/converter')
    toast({
      title: "Redirigiendo al Convertidor",
      description: `Puedes intercambiar ${item.name} en el convertidor`,
    })
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: num < 1 ? 4 : 2,
      maximumFractionDigits: num < 1 ? 4 : 2
    }).format(num)
  }

  const filteredItems = watchlistItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue, bValue
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'change':
        aValue = a.change
        bValue = b.change
        break
      default:
        return 0
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const favoriteItems = sortedItems.filter(item => item.isFavorite)
  const otherItems = sortedItems.filter(item => !item.isFavorite)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mi Watchlist</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Sigue tus criptomonedas favoritas • {watchlistItems.length} monedas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('name')}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Ordenar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            Buscar en tu Watchlist
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
        <Card className="border-dashed border-2">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tu watchlist está vacío</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Agrega criptomonedas desde la página de Mercados para empezar a seguir sus precios y recibir actualizaciones
            </p>
            <Button onClick={() => navigate('/markets')} className="gap-2">
              <Search className="h-4 w-4" />
              Explorar Mercados
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {favoriteItems.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-yellow-700 dark:text-yellow-400">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  Favoritos ({favoriteItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4">
                  {favoriteItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 sm:p-6 border rounded-xl hover:bg-background/50 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
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
                            onClick={() => toggleFavorite(item.id)}
                            className="text-yellow-500 hover:text-yellow-600 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(item)}
                            className="text-blue-500 hover:text-blue-600 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTrade(item)}
                            className="text-green-500 hover:text-green-600 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromWatchlist(item.id)}
                            className="text-red-500 hover:text-red-600 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
                <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                  <span>Todas las Criptomonedas ({otherItems.length})</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('price')}
                      className="text-xs"
                    >
                      Precio {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('change')}
                      className="text-xs"
                    >
                      Cambio {sortBy === 'change' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4">
                  {otherItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 sm:p-6 border rounded-xl hover:bg-muted/30 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
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
                            onClick={() => toggleFavorite(item.id)}
                            className="text-muted-foreground hover:text-yellow-500 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <StarOff className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(item)}
                            className="text-blue-500 hover:text-blue-600 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTrade(item)}
                            className="text-green-500 hover:text-green-600 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromWatchlist(item.id)}
                            className="text-red-500 hover:text-red-600 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
