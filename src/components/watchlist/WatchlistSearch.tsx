
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface WatchlistSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

const WatchlistSearch = ({ searchTerm, onSearchChange }: WatchlistSearchProps) => {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50 shadow-lg border-gray-200 dark:border-gray-800 backdrop-blur-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          Buscar en tu Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Input
          placeholder="Buscar por nombre o símbolo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-200"
        />
      </CardContent>
    </Card>
  )
}

export default WatchlistSearch
