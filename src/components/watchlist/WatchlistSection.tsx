
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import WatchlistItem from "./WatchlistItem"

interface WatchlistSectionProps {
  title: string
  items: any[]
  isFavoriteSection?: boolean
  sortBy: string
  sortOrder: string
  onSort: (field: 'name' | 'price' | 'change') => void
  onToggleFavorite: (id: number) => void
  onViewDetails: (item: any) => void
  onTrade: (item: any) => void
  onRemove: (id: number) => void
}

const WatchlistSection = ({
  title,
  items,
  isFavoriteSection = false,
  sortBy,
  sortOrder,
  onSort,
  onToggleFavorite,
  onViewDetails,
  onTrade,
  onRemove
}: WatchlistSectionProps) => {
  const cardClass = isFavoriteSection 
    ? "border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800"
    : ""

  const titleClass = isFavoriteSection
    ? "text-yellow-700 dark:text-yellow-400"
    : ""

  return (
    <Card className={cardClass}>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className={`flex items-center justify-between text-base sm:text-lg lg:text-xl ${titleClass}`}>
          <span className="flex items-center gap-2">
            {isFavoriteSection && <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />}
            {title}
          </span>
          {!isFavoriteSection && (
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort('price')}
                className="text-xs sm:text-sm p-1 sm:p-2"
              >
                Precio {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort('change')}
                className="text-xs sm:text-sm p-1 sm:p-2"
              >
                Cambio {sortBy === 'change' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-2 sm:gap-3 lg:gap-4">
          {items.map((item) => (
            <WatchlistItem
              key={item.id}
              item={item}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
              onTrade={onTrade}
              onRemove={onRemove}
              isFavorite={isFavoriteSection}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WatchlistSection
