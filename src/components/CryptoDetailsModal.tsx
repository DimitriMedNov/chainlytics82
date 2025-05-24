
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import CryptoHeader from "./crypto/CryptoHeader"
import CryptoPriceSection from "./crypto/CryptoPriceSection"
import CryptoPriceChart from "./crypto/CryptoPriceChart"
import CryptoMarketStats from "./crypto/CryptoMarketStats"
import CryptoAdditionalInfo from "./crypto/CryptoAdditionalInfo"

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
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (coin && open) {
      setChartData(generateMockChartData(coin.symbol, coin.price))
      setLastUpdated(new Date())
      
      // Check if coin is already in watchlist (from localStorage)
      const watchlist = JSON.parse(localStorage.getItem('crypto-watchlist') || '[]')
      setIsInWatchlist(watchlist.some((item: any) => item.symbol === coin.symbol))
    }
  }, [coin, open])

  if (!coin) return null

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('crypto-watchlist') || '[]')
    
    if (isInWatchlist) {
      // Remove from watchlist
      const updatedWatchlist = watchlist.filter((item: any) => item.symbol !== coin.symbol)
      localStorage.setItem('crypto-watchlist', JSON.stringify(updatedWatchlist))
      setIsInWatchlist(false)
      toast({
        title: "Eliminado de Watchlist",
        description: `${coin.name} ha sido eliminado de tu watchlist`,
      })
    } else {
      // Add to watchlist
      const newItem = {
        id: Date.now(),
        name: coin.name,
        symbol: coin.symbol,
        price: coin.price,
        change: coin.change,
        isFavorite: false
      }
      const updatedWatchlist = [...watchlist, newItem]
      localStorage.setItem('crypto-watchlist', JSON.stringify(updatedWatchlist))
      setIsInWatchlist(true)
      toast({
        title: "Agregado a Watchlist",
        description: `${coin.name} ha sido agregado a tu watchlist`,
      })
    }
  }

  const handleExchange = () => {
    // Close modal first
    onOpenChange(false)
    // Navigate to converter page
    navigate('/converter')
    toast({
      title: "Redirigiendo al Convertidor",
      description: `Puedes intercambiar ${coin.name} en el convertidor de divisas`,
    })
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
          <DialogTitle>
            <CryptoHeader
              coin={coin}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={toggleWatchlist}
              onExchange={handleExchange}
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 sm:space-y-8">
          <CryptoPriceSection coin={coin} additionalData={additionalData} />
          <CryptoPriceChart chartData={chartData} />
          <CryptoMarketStats coin={coin} additionalData={additionalData} />
          <CryptoAdditionalInfo coin={coin} lastUpdated={lastUpdated} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CryptoDetailsModal
