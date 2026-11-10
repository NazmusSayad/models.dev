export interface ApiPricingTier {
  input?: number
  output?: number
  cache_read?: number
  cache_write?: number
  tier?: {
    type?: string
    size?: number
  }
}

export function normalizeModels(data: unknown): FlatModel[] {
  const models: FlatModel[] = []
  const providers = data as Record<
    string,
    {
      name?: string
      api?: string
      doc?: string
      env?: string[]
      npm?: string
      models?: Record<string, unknown>
    }
  >

  for (const providerId in providers) {
    const provider = providers[providerId]
    if (!provider || typeof provider !== 'object' || !provider.models) continue

    for (const modelId in provider.models) {
      const model = provider.models[modelId] as Record<string, unknown>
      if (!model || typeof model !== 'object') continue

      const cost = (model.cost as Record<string, unknown>) || {}
      const limit = (model.limit as Record<string, number>) || {}
      const modalities =
        (model.modalities as { input?: string[]; output?: string[] }) || {}
      const modelProvider =
        (model.provider as {
          api?: string
          npm?: string
          shape?: string
        }) || {}
      const rawTiers = (cost.tiers as ApiPricingTier[]) || []
      const tiers = rawTiers
        .map((tier) => ({
          size: tier.tier?.size ?? 0,
          input: tier.input,
          output: tier.output,
          cacheRead: tier.cache_read,
          cacheWrite: tier.cache_write,
        }))
        .sort((a, b) => a.size - b.size)
      const contextOver200k =
        (cost.context_over_200k as Record<string, number>) ||
        getTierAtContext(tiers, 200000)

      models.push({
        providerId,
        providerName: (provider.name as string) || providerId,
        providerApi: modelProvider.api || provider.api,
        providerDoc: provider.doc,
        providerEnv: provider.env || [],
        providerNpm: modelProvider.npm || provider.npm,
        id: (model.id as string) || modelId,
        name: (model.name as string) || modelId,
        description: (model.description as string) || '',
        family: (model.family as string) || '',
        type: (model.type as string) || 'chat',
        canonicalModelId: model.canonical_model_id as string | undefined,
        attachment: !!model.attachment,
        reasoning: !!model.reasoning,
        tool_call: !!model.tool_call,
        temperature:
          typeof model.temperature === 'boolean' ? model.temperature : null,
        knowledge: model.knowledge as string | undefined,
        release_date: model.release_date as string | undefined,
        last_updated: model.last_updated as string | undefined,
        modalitiesInput: modalities.input || [],
        modalitiesOutput: modalities.output || [],
        open_weights: !!model.open_weights,
        reasoningOptions: (
          (model.reasoning_options as { type?: string }[]) || []
        )
          .map((option) => option.type)
          .filter((type): type is string => Boolean(type)),
        interleaved: (model.interleaved as { field?: string } | undefined)
          ?.field,
        costInput: cost.input as number,
        costOutput: cost.output as number,
        costCacheRead: cost.cache_read as number,
        costCacheWrite: cost.cache_write as number,
        costReasoning: cost.reasoning as number,
        costInputAudio: cost.input_audio as number,
        costOutputAudio: cost.output_audio as number,
        contextLimit: limit.context,
        inputLimit: limit.input,
        outputLimit: limit.output,
        costOver200kInput: contextOver200k.input,
        costOver200kOutput: contextOver200k.output,
        costOver200kCacheRead: contextOver200k.cache_read,
        costOver200kCacheWrite: contextOver200k.cache_write,
        tiers,
        tierCount: tiers.length,
        isFree:
          typeof cost.input === 'number' && typeof cost.output === 'number'
            ? cost.input === 0 && cost.output === 0
            : null,
        structuredOutput:
          typeof model.structured_output === 'boolean'
            ? model.structured_output
            : null,
        status: (model.status as string) || 'active',
      })
    }
  }

  return models
}

function getTierAtContext(
  tiers: FlatModel['tiers'],
  context: number
): Record<string, number | undefined> {
  let selected: FlatModel['tiers'][number] | undefined

  for (const tier of tiers) {
    if (tier.size <= context) selected = tier
  }

  if (!selected) return {}

  return {
    input: selected.input,
    output: selected.output,
    cache_read: selected.cacheRead,
    cache_write: selected.cacheWrite,
  }
}

export interface ApiModel {
  id: string
  name?: string
  description?: string
  family?: string
  type?: string
  canonical_model_id?: string
  attachment?: boolean
  reasoning?: boolean
  tool_call?: boolean
  temperature?: boolean
  knowledge?: string
  release_date?: string
  last_updated?: string
  modalities?: { input?: string[]; output?: string[] }
  open_weights?: boolean
  reasoning_options?: { type?: string; values?: string[] }[]
  cost?: {
    input?: number
    output?: number
    cache_read?: number
    cache_write?: number
    reasoning?: number
    input_audio?: number
    output_audio?: number
    tiers?: ApiPricingTier[]
    context_over_200k?: {
      input?: number
      output?: number
      cache_read?: number
      cache_write?: number
    }
  }
  limit?: {
    context?: number
    output?: number
    input?: number
  }
  structured_output?: boolean
  status?: string
  interleaved?: { field: string }
  provider?: { api?: string; npm?: string; shape?: string }
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

export interface PricingTier {
  size: number
  input?: number
  output?: number
  cacheRead?: number
  cacheWrite?: number
}

export interface FlatModel {
  id: string
  name: string
  description: string
  providerId: string
  providerName: string
  providerApi?: string
  providerDoc?: string
  providerEnv: string[]
  providerNpm?: string
  family: string
  type: string
  canonicalModelId?: string
  attachment: boolean
  reasoning: boolean
  tool_call: boolean
  temperature: boolean | null
  knowledge?: string
  release_date?: string
  last_updated?: string
  modalitiesInput: string[]
  modalitiesOutput: string[]
  open_weights: boolean
  reasoningOptions: string[]
  interleaved?: string
  costInput?: number
  costOutput?: number
  costCacheRead?: number
  costCacheWrite?: number
  costReasoning?: number
  costInputAudio?: number
  costOutputAudio?: number
  inputLimit?: number
  outputLimit?: number
  contextLimit?: number
  costOver200kInput?: number
  costOver200kOutput?: number
  costOver200kCacheRead?: number
  costOver200kCacheWrite?: number
  tiers: PricingTier[]
  tierCount: number
  isFree: boolean | null
  structuredOutput: boolean | null
  status: string
}
