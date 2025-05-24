
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Search } from "lucide-react"

interface WatchlistEmptyStateProps {
  onNavigateToMarkets: () => void
}

const WatchlistEmptyState = ({ onNavigateToMarkets }: WatchlistEmptyStateProps) => {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Star className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Tu watchlist está vacío</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Agrega criptomonedas desde la página de Mercados para empezar a seguir sus precios y recibir actualizaciones
        </p>
        <Button onClick={onNavigateToMarkets} className="gap-2">
          <Search className="h-4 w-4" />
          Explorar Mercados
        </Button>
      </CardContent>
    </Card>
  )
}

export default WatchlistEmptyState
