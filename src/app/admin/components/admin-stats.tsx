import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    title: 'Orders',
    value: '2,350',
    change: '+15.3%',
    changeType: 'positive',
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    value: '12,234',
    change: '+7.2%',
    changeType: 'positive',
    icon: Users,
  },
  {
    title: 'Products',
    value: '573',
    change: '+2.1%',
    changeType: 'positive',
    icon: Package,
  },
]

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
