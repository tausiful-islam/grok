'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

interface SalesData {
  month: string
  sales: number
}

export function SalesChart() {
  const [data, setData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      setLoading(true)

      // Fetch orders from the last 6 months
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group orders by month
      const monthlySales = new Map<string, number>()

      orders?.forEach((order: any) => {
        const date = new Date(order.created_at)
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' })

        monthlySales.set(monthKey, (monthlySales.get(monthKey) || 0) + order.total_amount)
      })

      // Convert to array format for the chart
      const chartData: SalesData[] = Array.from(monthlySales.entries()).map(([month, sales]) => ({
        month,
        sales: Math.round(sales)
      }))

      // If no data, show empty chart
      if (chartData.length === 0) {
        setData([
          { month: 'Jan', sales: 0 },
          { month: 'Feb', sales: 0 },
          { month: 'Mar', sales: 0 },
          { month: 'Apr', sales: 0 },
          { month: 'May', sales: 0 },
          { month: 'Jun', sales: 0 },
        ])
      } else {
        setData(chartData)
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
      // Set default empty data on error
      setData([
        { month: 'Jan', sales: 0 },
        { month: 'Feb', sales: 0 },
        { month: 'Mar', sales: 0 },
        { month: 'Apr', sales: 0 },
        { month: 'May', sales: 0 },
        { month: 'Jun', sales: 0 },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxSales = Math.max(...data.map(d => d.sales))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end space-x-2">
          {data.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: maxSales > 0 ? `${(item.sales / maxSales) * 200}px` : '20px',
                  minHeight: '20px'
                }}
              />
              <span className="text-xs text-muted-foreground mt-2">
                {item.month}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Monthly sales performance
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
