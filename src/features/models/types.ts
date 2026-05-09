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
