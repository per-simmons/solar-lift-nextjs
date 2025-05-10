import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solar Lift Blog - Expert Solar Industry Insights',
  description: 'Expert insights, industry trends, and practical advice to help solar companies generate more qualified leads and grow their business.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      {children}
    </main>
  )
}
