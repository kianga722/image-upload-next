import type { Metadata } from 'next'
import EmotionRootStyleRegistry from './emotion-root-style-registry'

export const metadata: Metadata = {
  title: 'Image Gallery',
  description: 'Image Gallery and Upload',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <EmotionRootStyleRegistry>{children}</EmotionRootStyleRegistry>
      </body>
    </html>
  )
}
