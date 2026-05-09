import { ModelsPage } from '@/features/models'
import { normalizeModels } from '@/features/models/data'

export default async function HomePage() {
  const res = await fetch('https://models.dev/api.json', {
    cache: 'no-store',
  })
  const data = await res.json()
  const models = normalizeModels(data)

  return <ModelsPage models={models} />
}
