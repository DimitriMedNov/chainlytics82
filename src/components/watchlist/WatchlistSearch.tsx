
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
      </CardContent>
    </Card>
  )
}

export default WatchlistSearch
