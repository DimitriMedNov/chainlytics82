
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Calculator } from "lucide-react"

const Converter = () => {
  const [fromAmount, setFromAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("USD")
  const [result, setResult] = useState("")

  const currencies = [
    { symbol: "BTC", name: "Bitcoin", price: 45000 },
    { symbol: "ETH", name: "Ethereum", price: 3200 },
    { symbol: "ADA", name: "Cardano", price: 0.45 },
    { symbol: "SOL", name: "Solana", price: 95 },
    { symbol: "USD", name: "US Dollar", price: 1 },
    { symbol: "EUR", name: "Euro", price: 0.85 },
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

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Convertidor de Cryptos</h1>
        <p className="text-muted-foreground">Convierte entre diferentes criptomonedas y monedas fiat</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Convertidor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Desde</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.symbol}</span>
                            <span className="text-muted-foreground text-xs">{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="icon" onClick={swapCurrencies}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hacia</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Resultado"
                    value={result}
                    readOnly
                    className="flex-1 bg-muted"
                  />
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.symbol}</span>
                            <span className="text-muted-foreground text-xs">{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertCurrency} className="w-full">
                Convertir
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Tasas de Cambio Actuales</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {currencies.slice(0, 4).map((currency) => (
                  <div key={currency.symbol} className="flex justify-between">
                    <span>{currency.symbol}</span>
                    <span>${currency.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Conversiones Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">1 BTC</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-medium">$45,000</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">1 ETH</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-medium">$3,200</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">1000 ADA</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-medium">$450</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">10 SOL</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-medium">$950</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Converter
