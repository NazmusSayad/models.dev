import { FlatModel } from './types'

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
