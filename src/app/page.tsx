'use client'

import dynamic from 'next/dynamic'

const ModelsPage = dynamic(
  () => import('@/features/models').then((mod) => mod.ModelsPage),
  { ssr: false }
)

export default function HomePage() {
  return <ModelsPage />
}
