
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, Plus } from "lucide-react"

const Portfolio = () => {
  const [portfolioData] = useState([
    { name: "Bitcoin", symbol: "BTC", amount: 0.5, price: 45000, change: 2.5 },
    { name: "Ethereum", symbol: "ETH", amount: 2.3, price: 3200, change: -1.2 },
    { name: "Cardano", symbol: "ADA", amount: 1000, price: 0.45, change: 5.8 },
  ])

  const totalValue = portfolioData.reduce((sum, coin) => sum + (coin.amount * coin.price), 0)

  const chartData = portfolioData.map((coin, index) => ({
    name: coin.symbol,
    value: coin.amount * coin.price,
    color: ['#8989DE', '#9D9DD1', '#B3B3C4'][index % 3]
  }))

  const performanceData = [
    { date: "Jan", value: 15000 },
    { date: "Feb", value: 18000 },
    { date: "Mar", value: 22000 },
    { date: "Apr", value: 25000 },
    { date: "May", value: totalValue },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mi Portfolio</h1>
          <p className="text-muted-foreground">Gestiona tus inversiones en criptomonedas</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Crypto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Mejor Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">ADA</div>
            <p className="text-xs text-muted-foreground">+5.8% hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.length}</div>
            <p className="text-xs text-muted-foreground">Criptomonedas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Distribución del Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Valor']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento del Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Valor']} />
                  <Line type="monotone" dataKey="value" stroke="#8989DE" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioData.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {coin.symbol.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{coin.name}</h3>
                    <p className="text-sm text-muted-foreground">{coin.amount} {coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(coin.amount * coin.price).toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    {coin.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <Badge variant={coin.change > 0 ? "default" : "destructive"}>
                      {coin.change > 0 ? '+' : ''}{coin.change}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Portfolio
