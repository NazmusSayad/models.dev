import { ModelsPage } from '@/features/models'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <ModelsPage />
    </Suspense>
  )
}
