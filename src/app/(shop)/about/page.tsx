import { Metadata } from 'next'
import { AboutHero } from './components/about-hero'
import { AboutStats } from './components/about-stats'
import { AboutTeam } from './components/about-team'
import { AboutValues } from './components/about-values'

export const metadata: Metadata = {
  title: 'About Us - E-Shop',
  description: 'Learn about our mission, values, and the team behind E-Shop',
}

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <AboutHero />
      <AboutStats />
      <AboutValues />
      <AboutTeam />
    </div>
  )
}
