import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile - It\'s Your Choice',
  description: 'Manage your account, view orders, and update your information',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
