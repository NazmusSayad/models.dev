import MiniSearch from 'minisearch'
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
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  const [filters, setFilters] = useState<FilterState>({
    providers: [],
    families: [],
    openWeights: null,
    reasoning: null,
    toolCall: null,
    attachment: null,
    modalities: [],
  })

  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ['name', 'id', 'family', 'providerName'],
      storeFields: ['id'],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
      },
    })
    ms.addAll(models.map((m, idx) => ({ ...m, id: m.id + '::' + idx })))
    return ms
  }, [models])

  const filteredModels = useMemo(() => {
    let result = models

    if (deferredSearch.trim()) {
      const hits = miniSearch.search(deferredSearch.trim())
      const hitIds = new Set(hits.map((h) => h.id as string))
      result = result.filter((m, idx) => hitIds.has(m.id + '::' + idx))
    }

    if (filters.providers.length > 0) {
      result = result.filter((m) => filters.providers.includes(m.providerId))
    }
    if (filters.families.length > 0) {
      result = result.filter((m) => filters.families.includes(m.family))
    }
    if (filters.openWeights !== null) {
      result = result.filter((m) => m.open_weights === filters.openWeights)
    }
    if (filters.reasoning !== null) {
      result = result.filter((m) => m.reasoning === filters.reasoning)
    }
    if (filters.toolCall !== null) {
      result = result.filter((m) => m.tool_call === filters.toolCall)
    }
    if (filters.attachment !== null) {
      result = result.filter((m) => m.attachment === filters.attachment)
    }
    if (filters.modalities.length > 0) {
      result = result.filter((m) =>
        filters.modalities.some(
          (mod) =>
            m.modalitiesInput.includes(mod) || m.modalitiesOutput.includes(mod)
        )
      )
    }

    return result
  }, [models, deferredSearch, miniSearch, filters])

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

  const toggleFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const toggleArrayFilter = useCallback(
    <K extends 'providers' | 'families' | 'modalities'>(
      key: K,
      value: string
    ) => {
      setFilters((prev) => {
        const arr = prev[key]
        const exists = arr.includes(value)
        const next = exists ? arr.filter((v) => v !== value) : [...arr, value]
        return { ...prev, [key]: next }
      })
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters({
      providers: [],
      families: [],
      openWeights: null,
      reasoning: null,
      toolCall: null,
      attachment: null,
      modalities: [],
    })
    setSearch('')
  }, [])

  return {
    search,
    setSearch,
    filters,
    toggleFilter,
    toggleArrayFilter,
    resetFilters,
    filteredModels,
    uniqueProviders,
    uniqueFamilies,
    uniqueModalities,
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

        // Strategy 1: Try live API
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
          // ignore, try next
        }

        // Strategy 2: Use bundled static data
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

        // Strategy 3: Fallback to cached copy in localStorage
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
