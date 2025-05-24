
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp as ChartIcon } from "lucide-react"

interface CryptoPriceChartProps {
  chartData: Array<{
    date: string
    price: number
  }>
}

const CryptoPriceChart = ({ chartData }: CryptoPriceChartProps) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: num < 1 ? 4 : 2,
      maximumFractionDigits: num < 1 ? 4 : 2
    }).format(num)
  }

  return (
    <div className="p-3 sm:p-6 border rounded-xl bg-gradient-to-br from-background to-muted/20">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <ChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
        <h3 className="text-sm sm:text-lg font-semibold">Gráfico de Precios (30 días)</h3>
      </div>
      <div className="h-[200px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontSize: '12px' }}
              itemStyle={{ color: "#8989DE", fontSize: '12px' }}
              formatter={(value) => [formatCurrency(Number(value)), 'Precio']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8989DE" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#8989DE" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CryptoPriceChart
