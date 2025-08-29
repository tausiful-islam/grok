import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const topProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    sales: 245,
    revenue: '$12,250',
    growth: '+12%',
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    sales: 189,
    revenue: '$37,800',
    growth: '+8%',
  },
  {
    id: '3',
    name: 'Gaming Mechanical Keyboard',
    sales: 156,
    revenue: '$7,800',
    growth: '+15%',
  },
  {
    id: '4',
    name: 'Wireless Charging Pad',
    sales: 134,
    revenue: '$2,680',
    growth: '+5%',
  },
  {
    id: '5',
    name: 'Portable Power Bank',
    sales: 98,
    revenue: '$2,940',
    growth: '+22%',
  },
]

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sales} sales
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-medium">{product.revenue}</p>
                <Badge variant="secondary" className="text-xs">
                  {product.growth}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/admin/products"
            className="text-sm text-primary hover:underline"
          >
            View all products →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
