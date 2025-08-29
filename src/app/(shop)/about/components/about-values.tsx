import { Shield, Heart, Zap, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AboutValues() {
  const values = [
    {
      icon: Shield,
      title: 'Quality & Trust',
      description: 'We stand behind every product we sell with our quality guarantee and transparent practices.'
    },
    {
      icon: Heart,
      title: 'Customer Centric',
      description: 'Your satisfaction is our top priority. We listen, adapt, and continuously improve our service.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We embrace technology and new ideas to provide you with the best shopping experience possible.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in building lasting relationships and fostering a community of happy customers.'
    }
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do and shape our commitment to you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
