import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ContactInfo() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: ['support@eshop.com', 'business@eshop.com'],
      description: 'Send us an email anytime!'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Mon-Fri from 8am to 5pm.'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: ['123 Commerce Street', 'Business District, NY 10001'],
      description: 'Come visit our headquarters.'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8am - 5pm', 'Saturday: 9am - 3pm', 'Sunday: Closed'],
      description: 'We\'re here when you need us.'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactInfo.map((info, index) => (
          <div key={index} className="flex space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <info.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-sm text-muted-foreground">
                    {detail}
                  </p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {info.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
