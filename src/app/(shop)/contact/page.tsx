import { Metadata } from 'next'
import { ContactForm } from './components/contact-form'
import { ContactInfo } from './components/contact-info'
import { ContactMap } from './components/contact-map'

export const metadata: Metadata = {
  title: 'Contact Us - It\'s Your Choice',
  description: 'Get in touch with our customer support team',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactForm />
        <div className="space-y-8">
          <ContactInfo />
          <ContactMap />
        </div>
      </div>
    </div>
  )
}
