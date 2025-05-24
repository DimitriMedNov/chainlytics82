
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Calculator, TrendingUp, TrendingDown, Star, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const Converter = () => {
  const [fromAmount, setFromAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("USD")
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)

  const currencies = [
    { symbol: "BTC", name: "Bitcoin", price: 45000, change: 2.4, category: "Major" },
    { symbol: "ETH", name: "Ethereum", price: 3200, change: 1.8, category: "Major" },
    { symbol: "ADA", name: "Cardano", price: 0.45, change: -0.5, category: "Alt" },
    { symbol: "SOL", name: "Solana", price: 95, change: 5.2, category: "Alt" },
    { symbol: "USD", name: "US Dollar", price: 1, change: 0, category: "Fiat" },
    { symbol: "EUR", name: "Euro", price: 0.85, change: 0, category: "Fiat" },
  ]

  const convertCurrency = () => {
    if (!fromAmount || isNaN(Number(fromAmount))) {
      setResult("Ingresa un número válido")
      return
    }

    const fromPrice = currencies.find(c => c.symbol === fromCurrency)?.price || 1
    const toPrice = currencies.find(c => c.symbol === toCurrency)?.price || 1
    
    const fromValueInUSD = Number(fromAmount) * fromPrice
    const convertedValue = fromValueInUSD / toPrice
    
    setResult(convertedValue.toFixed(8))
  }

  const swapCurrencies = () => {
    const tempCurrency = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tempCurrency)
    setFromAmount(result)
    setResult(fromAmount)
  }

  const copyResult = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCurrencyInfo = (symbol: string) => {
    return currencies.find(c => c.symbol === symbol)
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString()}`
    }
    return `$${price}`
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Convertidor de Cryptos
        </h1>
        <p className="text-muted-foreground text-lg">
          Convierte entre diferentes criptomonedas y monedas fiat con tasas en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Converter */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-6 w-6 text-blue-600" />
                Convertidor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Desde</label>
                    {getCurrencyInfo(fromCurrency) && (
                      <Badge variant="outline" className="text-xs">
                        {getCurrencyInfo(fromCurrency)?.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1 h-12 text-lg font-medium border-2 focus:border-blue-500"
                    />
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="w-[160px] h-12 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.symbol} value={currency.symbol}>
                            <div className="flex items-center gap-3 w-full">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                {currency.symbol.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold">{currency.symbol}</span>
                                <span className="text-xs text-muted-foreground">{currency.name}</span>
                              </div>
                              <div className="ml-auto text-right">
                                <div className="text-xs font-medium">{formatPrice(currency.price)}</div>
                                <div className={`text-xs flex items-center gap-1 ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {currency.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                  {Math.abs(currency.change)}%
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {getCurrencyInfo(fromCurrency) && (
                    <div className="text-sm text-muted-foreground">
                      1 {fromCurrency} = {formatPrice(getCurrencyInfo(fromCurrency)!.price)}
                    </div>
                  )}
                </div>

                <div className="flex justify-center py-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={swapCurrencies}
                    className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <ArrowUpDown className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hacia</label>
                    {getCurrencyInfo(toCurrency) && (
                      <Badge variant="outline" className="text-xs">
                        {getCurrencyInfo(toCurrency)?.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="Resultado"
                        value={result}
                        readOnly
                        className="h-12 text-lg font-medium bg-gray-50 dark:bg-gray-800 border-2 pr-12"
                      />
                      {result && result !== "Ingresa un número válido" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={copyResult}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="w-[160px] h-12 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.symbol} value={currency.symbol}>
                            <div className="flex items-center gap-3 w-full">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                {currency.symbol.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold">{currency.symbol}</span>
                                <span className="text-xs text-muted-foreground">{currency.name}</span>
                              </div>
                              <div className="ml-auto text-right">
                                <div className="text-xs font-medium">{formatPrice(currency.price)}</div>
                                <div className={`text-xs flex items-center gap-1 ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {currency.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                  {Math.abs(currency.change)}%
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {getCurrencyInfo(toCurrency) && (
                    <div className="text-sm text-muted-foreground">
                      1 {toCurrency} = {formatPrice(getCurrencyInfo(toCurrency)!.price)}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={convertCurrency} 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Convertir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Current Rates */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Tasas Actuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currencies.slice(0, 4).map((currency) => (
                  <div key={currency.symbol} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {currency.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{currency.symbol}</div>
                        <div className="text-xs text-muted-foreground">{currency.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(currency.price)}</div>
                      <div className={`text-xs flex items-center gap-1 justify-end ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {currency.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(currency.change)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Convert */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                Conversiones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { from: "1 BTC", to: "$45,000", desc: "Bitcoin a USD" },
                  { from: "1 ETH", to: "$3,200", desc: "Ethereum a USD" },
                  { from: "1000 ADA", to: "$450", desc: "Cardano a USD" },
                  { from: "10 SOL", to: "$950", desc: "Solana a USD" },
                ].map((conversion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div>
                      <div className="font-medium">{conversion.from}</div>
                      <div className="text-xs text-muted-foreground">{conversion.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{conversion.to}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Converter
