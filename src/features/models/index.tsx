'use client'

import dynamic from 'next/dynamic'
import { FlatModel } from './helpers/data'
const ModelsPageCore = dynamic(
  () => import('./models-page').then((mod) => mod.ModelsPageCore),
  {
    ssr: false,
  }
)

export function ModelsPage({ models }: { models: FlatModel[] }) {
  return <ModelsPageCore models={models} />
}
