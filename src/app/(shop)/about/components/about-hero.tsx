import { ShoppingBag, Users, Award, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AboutHero() {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-primary">E-Shop</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We're passionate about connecting you with the best products from around the world.
            Our mission is to provide an exceptional online shopping experience with quality,
            convenience, and customer satisfaction at the heart of everything we do.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Quality Products</h3>
              <p className="text-sm text-muted-foreground">Carefully curated selection</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Customer First</h3>
              <p className="text-sm text-muted-foreground">Your satisfaction matters</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Quick and reliable shipping</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Trusted Service</h3>
              <p className="text-sm text-muted-foreground">Years of excellence</p>
            </div>
          </div>

          <Button size="lg" className="px-8">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  )
}
