import { ModelsPage } from '@/features/models'
import { normalizeModels } from '@/features/models/helpers/data'

export default async function HomePage() {
  const res = await fetch('https://models.dev/api.json', {
    next: { revalidate: 60 },
    cache: 'force-cache',
  })

  const data = await res.json()
  const models = normalizeModels(data)

  return <ModelsPage models={models} />
}
