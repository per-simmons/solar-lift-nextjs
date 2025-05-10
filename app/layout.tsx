import type { Metadata } from 'next'
import './globals.css'
import './fonts.css'

export const metadata: Metadata = {
  title: 'Solar Lift - More Solar Installs. Less Chasing Leads.',
  description: 'We deliver qualified homeowners actively looking for solar so your team can focus on closing deals, not chasing interest.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="preload" href="/assets/fonts/TestFoundersGrotesk-Regular-BF66175e972ac1c.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/TestFoundersGrotesk-Bold-BF66175e9700615.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body className="font-founders-grotesk">
        {children}
      </body>
    </html>
  )
}
