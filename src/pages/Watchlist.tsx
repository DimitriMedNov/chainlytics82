
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CryptoDetailsModal from "@/components/CryptoDetailsModal"
import WatchlistHeader from "@/components/watchlist/WatchlistHeader"
import WatchlistSearch from "@/components/watchlist/WatchlistSearch"
import WatchlistEmptyState from "@/components/watchlist/WatchlistEmptyState"
import WatchlistSection from "@/components/watchlist/WatchlistSection"
import { useWatchlistActions } from "@/hooks/useWatchlistActions"
import { useWatchlistSorting } from "@/hooks/useWatchlistSorting"

const Watchlist = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [watchlistItems, setWatchlistItems] = useState<any[]>([])
  const [selectedCoin, setSelectedCoin] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const { toggleFavorite, removeFromWatchlist, handleViewDetails, handleTrade } = useWatchlistActions()

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('crypto-watchlist') || '[]')
    console.log('Loaded watchlist:', savedWatchlist)
    setWatchlistItems(savedWatchlist)
  }, [])

  const filteredItems = watchlistItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const { sortBy, sortOrder, sortedItems, handleSort } = useWatchlistSorting(filteredItems)

  const favoriteItems = sortedItems.filter(item => item.isFavorite)
  const otherItems = sortedItems.filter(item => !item.isFavorite)

  const watchlistActions = {
    onToggleFavorite: (id: number) => toggleFavorite(id, watchlistItems, setWatchlistItems),
    onRemove: (id: number) => removeFromWatchlist(id, watchlistItems, setWatchlistItems),
    onViewDetails: (item: any) => handleViewDetails(item, setSelectedCoin, setIsModalOpen),
    onTrade: handleTrade
  }

  if (watchlistItems.length === 0) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-7xl mx-auto">
        <WatchlistHeader itemCount={0} onSort={() => handleSort('name')} />
        <WatchlistEmptyState onNavigateToMarkets={() => navigate('/markets')} />
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <WatchlistHeader itemCount={watchlistItems.length} onSort={() => handleSort('name')} />
      <WatchlistSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {favoriteItems.length > 0 && (
        <WatchlistSection
          title={`Favoritos (${favoriteItems.length})`}
          items={favoriteItems}
          isFavoriteSection={true}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          {...watchlistActions}
        />
      )}

      {otherItems.length > 0 && (
        <WatchlistSection
          title={`Todas las Criptomonedas (${otherItems.length})`}
          items={otherItems}
          isFavoriteSection={false}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          {...watchlistActions}
        />
      )}

      <CryptoDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        coin={selectedCoin}
      />
    </div>
  )
}

export default Watchlist
