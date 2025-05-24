
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

export const useWatchlistActions = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const toggleFavorite = (id: number, watchlistItems: any[], setWatchlistItems: (items: any[]) => void) => {
    console.log('Toggling favorite for id:', id)
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

  const removeFromWatchlist = (id: number, watchlistItems: any[], setWatchlistItems: (items: any[]) => void) => {
    console.log('Removing from watchlist id:', id)
    const item = watchlistItems.find(item => item.id === id)
    const updatedItems = watchlistItems.filter(item => item.id !== id)
    setWatchlistItems(updatedItems)
    localStorage.setItem('crypto-watchlist', JSON.stringify(updatedItems))
    
    toast({
      title: "Eliminado del Watchlist",
      description: `${item?.name} ha sido eliminado de tu watchlist`,
    })
  }

  const handleViewDetails = (item: any, setSelectedCoin: (coin: any) => void, setIsModalOpen: (open: boolean) => void) => {
    console.log('Viewing details for:', item)
    const coinForModal = {
      rank: item.rank || 1,
      name: item.name,
      symbol: item.symbol,
      price: item.price,
      change: item.change,
      marketCap: item.marketCap || item.price * 21000000,
      volume: item.volume || item.price * 1000000,
      category: item.category || 'cryptocurrency'
    }
    setSelectedCoin(coinForModal)
    setIsModalOpen(true)
  }

  const handleTrade = (item: any) => {
    console.log('Trading:', item)
    navigate('/converter')
    toast({
      title: "Redirigiendo al Convertidor",
      description: `Puedes intercambiar ${item.name} en el convertidor`,
    })
  }

  return {
    toggleFavorite,
    removeFromWatchlist,
    handleViewDetails,
    handleTrade
  }
}
