import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SalesChart() {
  // Mock data for the chart
  const data = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ]

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
                className="w-full bg-primary rounded-t"
                style={{
                  height: `${(item.sales / maxSales) * 200}px`,
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
