import Fuse from 'fuse.js'
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  useQueryState,
} from 'nuqs'
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { FlatModel } from './types'

export interface FilterState {
  providers: string[]
  families: string[]
  openWeights: boolean | null
  reasoning: boolean | null
  toolCall: boolean | null
  attachment: boolean | null
  modalities: string[]
}

export function useModelData(models: FlatModel[]) {
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''))
  const deferredSearch = useDeferredValue(search)

  const [providers, setProviders] = useQueryState(
    'providers',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [families, setFamilies] = useQueryState(
    'families',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [modalities, setModalities] = useQueryState(
    'modalities',
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [openWeightsRaw, setOpenWeights] = useQueryState(
    'openWeights',
    parseAsBoolean
  )
  const [reasoningRaw, setReasoning] = useQueryState(
    'reasoning',
    parseAsBoolean
  )
  const [toolCallRaw, setToolCall] = useQueryState('toolCall', parseAsBoolean)
  const [attachmentRaw, setAttachment] = useQueryState(
    'attachment',
    parseAsBoolean
  )

  const openWeights = openWeightsRaw ?? null
  const reasoning = reasoningRaw ?? null
  const toolCall = toolCallRaw ?? null
  const attachment = attachmentRaw ?? null

  const filters = useMemo<FilterState>(
    () => ({
      providers,
      families,
      openWeights,
      reasoning,
      toolCall,
      attachment,
      modalities,
    }),
    [
      providers,
      families,
      openWeights,
      reasoning,
      toolCall,
      attachment,
      modalities,
    ]
  )

  const fuse = useMemo(() => {
    return new Fuse(models, {
      keys: ['name', 'id', 'family', 'providerName'],
      threshold: 0.3,
      ignoreLocation: true,
    })
  }, [models])

  const filteredModels = useMemo(() => {
    let result = models

    if (deferredSearch.trim()) {
      const hits = fuse.search(deferredSearch.trim())
      result = hits.map((h) => h.item)
    }

    if (providers.length > 0) {
      result = result.filter((m) => providers.includes(m.providerId))
    }
    if (families.length > 0) {
      result = result.filter((m) => families.includes(m.family))
    }
    if (openWeights !== null) {
      result = result.filter((m) => m.open_weights === openWeights)
    }
    if (reasoning !== null) {
      result = result.filter((m) => m.reasoning === reasoning)
    }
    if (toolCall !== null) {
      result = result.filter((m) => m.tool_call === toolCall)
    }
    if (attachment !== null) {
      result = result.filter((m) => m.attachment === attachment)
    }
    if (modalities.length > 0) {
      result = result.filter((m) =>
        modalities.some(
          (mod) =>
            m.modalitiesInput.includes(mod) || m.modalitiesOutput.includes(mod)
        )
      )
    }

    return result
  }, [
    models,
    deferredSearch,
    fuse,
    providers,
    families,
    modalities,
    openWeights,
    reasoning,
    toolCall,
    attachment,
  ])

  const uniqueProviders = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of models) map.set(m.providerId, m.providerName)
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [models])

  const uniqueFamilies = useMemo(() => {
    const set = new Set<string>()
    for (const m of models) if (m.family) set.add(m.family)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [models])

  const uniqueModalities = useMemo(() => {
    const set = new Set<string>()
    for (const m of models) {
      for (const mod of m.modalitiesInput) set.add(mod)
      for (const mod of m.modalitiesOutput) set.add(mod)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [models])

  const toggleArrayFilter = useCallback(
    <K extends 'providers' | 'families' | 'modalities'>(
      key: K,
      value: string,
      setter: (v: string[] | null) => void
    ) => {
      const arr = filters[key]
      const exists = arr.includes(value)
      const next = exists ? arr.filter((v) => v !== value) : [...arr, value]
      setter(next.length > 0 ? next : null)
    },
    [filters]
  )

  const toggleBooleanFilter = useCallback(
    (setter: (v: boolean | null) => void, current: boolean | null) => {
      if (current === null) setter(true)
      else if (current === true) setter(false)
      else setter(null)
    },
    []
  )

  const resetFilters = useCallback(() => {
    void setSearch(null)
    void setProviders(null)
    void setFamilies(null)
    void setModalities(null)
    void setOpenWeights(null)
    void setReasoning(null)
    void setToolCall(null)
    void setAttachment(null)
  }, [
    setSearch,
    setProviders,
    setFamilies,
    setModalities,
    setOpenWeights,
    setReasoning,
    setToolCall,
    setAttachment,
  ])

  const activeCount =
    filters.providers.length +
    filters.families.length +
    (filters.openWeights !== null ? 1 : 0) +
    (filters.reasoning !== null ? 1 : 0) +
    (filters.toolCall !== null ? 1 : 0) +
    (filters.attachment !== null ? 1 : 0) +
    filters.modalities.length

  return {
    search,
    setSearch,
    filters,
    toggleArrayFilter,
    toggleBooleanFilter,
    resetFilters,
    filteredModels,
    uniqueProviders,
    uniqueFamilies,
    uniqueModalities,
    activeCount,
    setProviders,
    setFamilies,
    setModalities,
    setOpenWeights,
    setReasoning,
    setToolCall,
    setAttachment,
  }
}

export function useFetchModels() {
  const [models, setModels] = useState<FlatModel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const { normalizeModels } = await import('./data')

        try {
          const res = await fetch('https://models.dev/api.json', {
            cache: 'no-store',
          })
          if (res.ok) {
            const normalized = normalizeModels(await res.json())
            if (!cancelled) {
              setModels(normalized)
              setLoading(false)
              return
            }
          }
        } catch {
          // ignore
        }

        try {
          const data = await import('@/data/api-data.json')
          const normalized = normalizeModels(
            (data as { default?: unknown }).default ?? data
          )
          if (!cancelled) {
            setModels(normalized)
            setLoading(false)
            return
          }
        } catch {
          // ignore
        }

        try {
          const cached = localStorage.getItem('models-data')
          if (cached) {
            const normalized = normalizeModels(JSON.parse(cached))
            if (!cancelled) {
              setModels(normalized)
              setLoading(false)
              return
            }
          }
        } catch {
          // ignore
        }

        if (!cancelled) setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return { models, loading }
}
