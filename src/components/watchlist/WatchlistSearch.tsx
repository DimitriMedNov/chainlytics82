
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface WatchlistSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

const WatchlistSearch = ({ searchTerm, onSearchChange }: WatchlistSearchProps) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          Buscar en tu Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Input
          placeholder="Buscar por nombre o símbolo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full text-sm sm:text-base"
        />
      </CardContent>
    </Card>
  )
}

export default WatchlistSearch
