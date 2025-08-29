import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
  skills: string[]
}

export function AboutTeam() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Passionate about e-commerce and customer experience with 10+ years in retail.',
      image: '/images/team/sarah.jpg',
      skills: ['Leadership', 'Strategy', 'Customer Experience']
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      bio: 'Technology enthusiast focused on building scalable and secure platforms.',
      image: '/images/team/mike.jpg',
      skills: ['Full-Stack Development', 'Cloud Architecture', 'Security']
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Customer Success',
      bio: 'Dedicated to ensuring every customer has an exceptional shopping experience.',
      image: '/images/team/emily.jpg',
      skills: ['Customer Service', 'Operations', 'Quality Assurance']
    },
    {
      name: 'David Kim',
      role: 'Lead Designer',
      bio: 'Creative designer passionate about user experience and modern aesthetics.',
      image: '/images/team/david.jpg',
      skills: ['UI/UX Design', 'Branding', 'Product Design']
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals behind It&apos;s Your Choice who work tirelessly to bring you the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center overflow-hidden">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {member.bio}
                </p>

                <div className="flex flex-wrap gap-1 justify-center">
                  {member.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
