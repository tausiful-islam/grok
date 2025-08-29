import { Card, CardContent } from '@/components/ui/card'

export function AboutStats() {
  const stats = [
    {
      number: '50K+',
      label: 'Happy Customers',
      description: 'Satisfied shoppers worldwide'
    },
    {
      number: '10K+',
      label: 'Products',
      description: 'Wide range of quality items'
    },
    {
      number: '99%',
      label: 'Satisfaction Rate',
      description: 'Customer satisfaction guarantee'
    },
    {
      number: '24/7',
      label: 'Support',
      description: 'Always here to help'
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Numbers that speak to our commitment to excellence and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <h3 className="font-semibold mb-2">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
