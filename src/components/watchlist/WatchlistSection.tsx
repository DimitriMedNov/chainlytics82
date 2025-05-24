
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
    ? "border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-orange-50/30 dark:from-yellow-950/20 dark:to-orange-950/10 dark:border-yellow-800 shadow-sm"
    : "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50 shadow-sm border-gray-200 dark:border-gray-800"

  const titleClass = isFavoriteSection
    ? "text-yellow-700 dark:text-yellow-400"
    : "text-gray-900 dark:text-gray-100"

  return (
    <Card className={`${cardClass} backdrop-blur-sm`}>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className={`flex items-center justify-between text-lg sm:text-xl lg:text-2xl font-bold ${titleClass}`}>
          <span className="flex items-center gap-2 sm:gap-3">
            {isFavoriteSection && <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />}
            {title}
          </span>
          {!isFavoriteSection && (
            <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort('price')}
                className="text-sm sm:text-base p-2 sm:p-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Precio {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort('change')}
                className="text-sm sm:text-base p-2 sm:p-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cambio {sortBy === 'change' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 sm:space-y-4">
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
      </CardContent>
    </Card>
  )
}

export default WatchlistSection
