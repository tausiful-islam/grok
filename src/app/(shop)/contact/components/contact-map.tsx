import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ContactMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Us</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Placeholder for map - in a real app, you'd integrate with Google Maps or similar */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="text-center space-y-2">
            <MapPin className="w-8 h-8 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Interactive map would be displayed here
            </p>
            <p className="text-xs text-muted-foreground">
              123 Commerce Street, Business District, NY 10001
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Directions</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Take the subway to Commerce Station</p>
            <p>• Walk 2 blocks north on Commerce Street</p>
            <p>• Look for the blue building on the right</p>
            <p>• We&apos;re on the 5th floor, Suite 501</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
