export function normalizeModels(data: unknown): FlatModel[] {
  const models: FlatModel[] = []
  const providers = data as Record<
    string,
    { name?: string; models?: Record<string, unknown> }
  >

  for (const providerId in providers) {
    const provider = providers[providerId]
    if (!provider || typeof provider !== 'object' || !provider.models) continue

    for (const modelId in provider.models) {
      const model = provider.models[modelId] as Record<string, unknown>
      if (!model || typeof model !== 'object') continue

      const cost = (model.cost as Record<string, number>) || {}
      const limit = (model.limit as Record<string, number>) || {}
      const modalities =
        (model.modalities as { input?: string[]; output?: string[] }) || {}

      models.push({
        providerId,
        providerName: (provider.name as string) || providerId,
        id: (model.id as string) || modelId,
        name: (model.name as string) || modelId,
        family: (model.family as string) || '',
        attachment: !!model.attachment,
        reasoning: !!model.reasoning,
        tool_call: !!model.tool_call,
        temperature: !!model.temperature,
        knowledge: model.knowledge as string | undefined,
        release_date: model.release_date as string | undefined,
        last_updated: model.last_updated as string | undefined,
        modalitiesInput: modalities.input || [],
        modalitiesOutput: modalities.output || [],
        open_weights: !!model.open_weights,
        costInput: cost.input ?? 0,
        costOutput: cost.output ?? 0,
        contextLimit: limit.context ?? 0,
        outputLimit: limit.output ?? 0,
      })
    }
  }

  return models
}

export interface ApiModel {
  id: string
  name?: string
  family?: string
  attachment?: boolean
  reasoning?: boolean
  tool_call?: boolean
  temperature?: boolean
  knowledge?: string
  release_date?: string
  last_updated?: string
  modalities?: { input?: string[]; output?: string[] }
  open_weights?: boolean
  cost?: {
    input?: number
    output?: number
    cache_read?: number
    cache_write?: number
    reasoning?: number
    context_over_200k?: { input?: number; output?: number; cache_read?: number }
  }
  limit?: {
    context?: number
    output?: number
    input?: number
  }
  structured_output?: boolean
  interleaved?: { field: string }
  experimental?: Record<string, unknown>
}

export interface ApiProvider {
  id: string
  name: string
  npm?: string
  api?: string
  doc?: string
  env?: string[]
  models: Record<string, ApiModel>
}

export interface ApiData {
  [providerId: string]: ApiProvider
}

export interface FlatModel {
  providerId: string
  providerName: string
  id: string
  name: string
  family: string
  attachment: boolean
  reasoning: boolean
  tool_call: boolean
  temperature: boolean
  knowledge?: string
  release_date?: string
  last_updated?: string
  modalitiesInput: string[]
  modalitiesOutput: string[]
  open_weights: boolean
  costInput: number
  costOutput: number
  contextLimit: number
  outputLimit: number
}
