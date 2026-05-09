/* eslint-disable max-lines */

import Fuse from 'fuse.js'
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'nuqs'
import { useCallback, useDeferredValue, useMemo } from 'react'
import { FlatModel } from './data'

export interface FilterState {
  providers: string[]
  families: string[]
  openWeights: boolean | null
  reasoning: boolean | null
  toolCall: boolean | null
  attachment: boolean | null
  modalities: string[]
  status: string[]
  costInputMin: number | null
  costInputMax: number | null
  costOutputMin: number | null
  costOutputMax: number | null
  costCacheReadMin: number | null
  costCacheReadMax: number | null
  costCacheWriteMin: number | null
  costCacheWriteMax: number | null
  costOver200kInputMin: number | null
  costOver200kInputMax: number | null
  costOver200kOutputMin: number | null
  costOver200kOutputMax: number | null
  costOver200kCacheReadMin: number | null
  costOver200kCacheReadMax: number | null
  contextLimitMin: number | null
  contextLimitMax: number | null
  inputLimitMin: number | null
  inputLimitMax: number | null
  outputLimitMin: number | null
  outputLimitMax: number | null
  knowledgeQuery: string | null
  releaseDateFrom: string | null
  releaseDateTo: string | null
  lastUpdatedFrom: string | null
  lastUpdatedTo: string | null
  structuredOutput: boolean | null
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
  const [status, setStatus] = useQueryState(
    'status',
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
  const [structuredOutputRaw, setStructuredOutput] = useQueryState(
    'structuredOutput',
    parseAsBoolean
  )

  const [knowledgeQuery, setKnowledgeQuery] = useQueryState(
    'knowledgeQuery',
    parseAsString
  )
  const [releaseDateFrom, setReleaseDateFrom] = useQueryState(
    'releaseDateFrom',
    parseAsString
  )
  const [releaseDateTo, setReleaseDateTo] = useQueryState(
    'releaseDateTo',
    parseAsString
  )
  const [lastUpdatedFrom, setLastUpdatedFrom] = useQueryState(
    'lastUpdatedFrom',
    parseAsString
  )
  const [lastUpdatedTo, setLastUpdatedTo] = useQueryState(
    'lastUpdatedTo',
    parseAsString
  )

  const [costInputMinRaw, setCostInputMin] = useQueryState(
    'costInputMin',
    parseAsFloat
  )
  const [costInputMaxRaw, setCostInputMax] = useQueryState(
    'costInputMax',
    parseAsFloat
  )
  const [costOutputMinRaw, setCostOutputMin] = useQueryState(
    'costOutputMin',
    parseAsFloat
  )
  const [costOutputMaxRaw, setCostOutputMax] = useQueryState(
    'costOutputMax',
    parseAsFloat
  )
  const [costCacheReadMinRaw, setCostCacheReadMin] = useQueryState(
    'costCacheReadMin',
    parseAsFloat
  )
  const [costCacheReadMaxRaw, setCostCacheReadMax] = useQueryState(
    'costCacheReadMax',
    parseAsFloat
  )
  const [costCacheWriteMinRaw, setCostCacheWriteMin] = useQueryState(
    'costCacheWriteMin',
    parseAsFloat
  )
  const [costCacheWriteMaxRaw, setCostCacheWriteMax] = useQueryState(
    'costCacheWriteMax',
    parseAsFloat
  )
  const [costOver200kInputMinRaw, setCostOver200kInputMin] = useQueryState(
    'costOver200kInputMin',
    parseAsFloat
  )
  const [costOver200kInputMaxRaw, setCostOver200kInputMax] = useQueryState(
    'costOver200kInputMax',
    parseAsFloat
  )
  const [costOver200kOutputMinRaw, setCostOver200kOutputMin] = useQueryState(
    'costOver200kOutputMin',
    parseAsFloat
  )
  const [costOver200kOutputMaxRaw, setCostOver200kOutputMax] = useQueryState(
    'costOver200kOutputMax',
    parseAsFloat
  )
  const [costOver200kCacheReadMinRaw, setCostOver200kCacheReadMin] =
    useQueryState('costOver200kCacheReadMin', parseAsFloat)
  const [costOver200kCacheReadMaxRaw, setCostOver200kCacheReadMax] =
    useQueryState('costOver200kCacheReadMax', parseAsFloat)
  const [contextLimitMinRaw, setContextLimitMin] = useQueryState(
    'contextLimitMin',
    parseAsInteger
  )
  const [contextLimitMaxRaw, setContextLimitMax] = useQueryState(
    'contextLimitMax',
    parseAsInteger
  )
  const [inputLimitMinRaw, setInputLimitMin] = useQueryState(
    'inputLimitMin',
    parseAsInteger
  )
  const [inputLimitMaxRaw, setInputLimitMax] = useQueryState(
    'inputLimitMax',
    parseAsInteger
  )
  const [outputLimitMinRaw, setOutputLimitMin] = useQueryState(
    'outputLimitMin',
    parseAsInteger
  )
  const [outputLimitMaxRaw, setOutputLimitMax] = useQueryState(
    'outputLimitMax',
    parseAsInteger
  )

  const openWeights = openWeightsRaw ?? null
  const reasoning = reasoningRaw ?? null
  const toolCall = toolCallRaw ?? null
  const attachment = attachmentRaw ?? null
  const structuredOutput = structuredOutputRaw ?? null
  const costInputMin = costInputMinRaw ?? null
  const costInputMax = costInputMaxRaw ?? null
  const costOutputMin = costOutputMinRaw ?? null
  const costOutputMax = costOutputMaxRaw ?? null
  const costCacheReadMin = costCacheReadMinRaw ?? null
  const costCacheReadMax = costCacheReadMaxRaw ?? null
  const costCacheWriteMin = costCacheWriteMinRaw ?? null
  const costCacheWriteMax = costCacheWriteMaxRaw ?? null
  const costOver200kInputMin = costOver200kInputMinRaw ?? null
  const costOver200kInputMax = costOver200kInputMaxRaw ?? null
  const costOver200kOutputMin = costOver200kOutputMinRaw ?? null
  const costOver200kOutputMax = costOver200kOutputMaxRaw ?? null
  const costOver200kCacheReadMin = costOver200kCacheReadMinRaw ?? null
  const costOver200kCacheReadMax = costOver200kCacheReadMaxRaw ?? null
  const contextLimitMin = contextLimitMinRaw ?? null
  const contextLimitMax = contextLimitMaxRaw ?? null
  const inputLimitMin = inputLimitMinRaw ?? null
  const inputLimitMax = inputLimitMaxRaw ?? null
  const outputLimitMin = outputLimitMinRaw ?? null
  const outputLimitMax = outputLimitMaxRaw ?? null

  const filters = useMemo<FilterState>(
    () => ({
      providers,
      families,
      openWeights,
      reasoning,
      toolCall,
      attachment,
      modalities,
      status,
      costInputMin,
      costInputMax,
      costOutputMin,
      costOutputMax,
      costCacheReadMin,
      costCacheReadMax,
      costCacheWriteMin,
      costCacheWriteMax,
      costOver200kInputMin,
      costOver200kInputMax,
      costOver200kOutputMin,
      costOver200kOutputMax,
      costOver200kCacheReadMin,
      costOver200kCacheReadMax,
      contextLimitMin,
      contextLimitMax,
      inputLimitMin,
      inputLimitMax,
      outputLimitMin,
      outputLimitMax,
      knowledgeQuery,
      releaseDateFrom,
      releaseDateTo,
      lastUpdatedFrom,
      lastUpdatedTo,
      structuredOutput,
    }),
    [
      providers,
      families,
      openWeights,
      reasoning,
      toolCall,
      attachment,
      modalities,
      status,
      costInputMin,
      costInputMax,
      costOutputMin,
      costOutputMax,
      costCacheReadMin,
      costCacheReadMax,
      costCacheWriteMin,
      costCacheWriteMax,
      costOver200kInputMin,
      costOver200kInputMax,
      costOver200kOutputMin,
      costOver200kOutputMax,
      costOver200kCacheReadMin,
      costOver200kCacheReadMax,
      contextLimitMin,
      contextLimitMax,
      inputLimitMin,
      inputLimitMax,
      outputLimitMin,
      outputLimitMax,
      knowledgeQuery,
      releaseDateFrom,
      releaseDateTo,
      lastUpdatedFrom,
      lastUpdatedTo,
      structuredOutput,
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
    if (status.length > 0) {
      result = result.filter((m) => status.includes(m.status))
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
    if (structuredOutput !== null) {
      result = result.filter((m) => m.structuredOutput === structuredOutput)
    }
    if (modalities.length > 0) {
      result = result.filter((m) =>
        modalities.some(
          (mod) =>
            m.modalitiesInput.includes(mod) || m.modalitiesOutput.includes(mod)
        )
      )
    }
    if (knowledgeQuery !== null && knowledgeQuery.trim()) {
      const q = knowledgeQuery.toLowerCase()
      result = result.filter((m) => m.knowledge?.toLowerCase().includes(q))
    }
    if (releaseDateFrom !== null) {
      result = result.filter((m) =>
        m.release_date ? m.release_date >= releaseDateFrom : false
      )
    }
    if (releaseDateTo !== null) {
      result = result.filter((m) =>
        m.release_date ? m.release_date <= releaseDateTo : false
      )
    }
    if (lastUpdatedFrom !== null) {
      result = result.filter((m) =>
        m.last_updated ? m.last_updated >= lastUpdatedFrom : false
      )
    }
    if (lastUpdatedTo !== null) {
      result = result.filter((m) =>
        m.last_updated ? m.last_updated <= lastUpdatedTo : false
      )
    }
    if (costInputMin !== null) {
      result = result.filter((m) => m.costInput >= costInputMin)
    }
    if (costInputMax !== null) {
      result = result.filter((m) => m.costInput <= costInputMax)
    }
    if (costOutputMin !== null) {
      result = result.filter((m) => m.costOutput >= costOutputMin)
    }
    if (costOutputMax !== null) {
      result = result.filter((m) => m.costOutput <= costOutputMax)
    }
    if (costCacheReadMin !== null) {
      result = result.filter((m) => m.costCacheRead >= costCacheReadMin)
    }
    if (costCacheReadMax !== null) {
      result = result.filter((m) => m.costCacheRead <= costCacheReadMax)
    }
    if (costCacheWriteMin !== null) {
      result = result.filter((m) => m.costCacheWrite >= costCacheWriteMin)
    }
    if (costCacheWriteMax !== null) {
      result = result.filter((m) => m.costCacheWrite <= costCacheWriteMax)
    }
    if (costOver200kInputMin !== null) {
      result = result.filter((m) => m.costOver200kInput >= costOver200kInputMin)
    }
    if (costOver200kInputMax !== null) {
      result = result.filter((m) => m.costOver200kInput <= costOver200kInputMax)
    }
    if (costOver200kOutputMin !== null) {
      result = result.filter(
        (m) => m.costOver200kOutput >= costOver200kOutputMin
      )
    }
    if (costOver200kOutputMax !== null) {
      result = result.filter(
        (m) => m.costOver200kOutput <= costOver200kOutputMax
      )
    }
    if (costOver200kCacheReadMin !== null) {
      result = result.filter(
        (m) => m.costOver200kCacheRead >= costOver200kCacheReadMin
      )
    }
    if (costOver200kCacheReadMax !== null) {
      result = result.filter(
        (m) => m.costOver200kCacheRead <= costOver200kCacheReadMax
      )
    }
    if (contextLimitMin !== null) {
      result = result.filter((m) => m.contextLimit >= contextLimitMin)
    }
    if (contextLimitMax !== null) {
      result = result.filter((m) => m.contextLimit <= contextLimitMax)
    }
    if (inputLimitMin !== null) {
      result = result.filter((m) => m.inputLimit >= inputLimitMin)
    }
    if (inputLimitMax !== null) {
      result = result.filter((m) => m.inputLimit <= inputLimitMax)
    }
    if (outputLimitMin !== null) {
      result = result.filter((m) => m.outputLimit >= outputLimitMin)
    }
    if (outputLimitMax !== null) {
      result = result.filter((m) => m.outputLimit <= outputLimitMax)
    }

    return result
  }, [
    models,
    deferredSearch,
    fuse,
    providers,
    families,
    status,
    modalities,
    openWeights,
    reasoning,
    toolCall,
    attachment,
    structuredOutput,
    knowledgeQuery,
    releaseDateFrom,
    releaseDateTo,
    lastUpdatedFrom,
    lastUpdatedTo,
    costInputMin,
    costInputMax,
    costOutputMin,
    costOutputMax,
    costCacheReadMin,
    costCacheReadMax,
    costCacheWriteMin,
    costCacheWriteMax,
    costOver200kInputMin,
    costOver200kInputMax,
    costOver200kOutputMin,
    costOver200kOutputMax,
    costOver200kCacheReadMin,
    costOver200kCacheReadMax,
    contextLimitMin,
    contextLimitMax,
    inputLimitMin,
    inputLimitMax,
    outputLimitMin,
    outputLimitMax,
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

  const uniqueStatuses = useMemo(() => {
    const set = new Set<string>()
    for (const m of models) set.add(m.status)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [models])

  const toggleArrayFilter = useCallback(
    <K extends 'providers' | 'families' | 'modalities' | 'status'>(
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
    void setStatus(null)
    void setOpenWeights(null)
    void setReasoning(null)
    void setToolCall(null)
    void setAttachment(null)
    void setStructuredOutput(null)
    void setKnowledgeQuery(null)
    void setReleaseDateFrom(null)
    void setReleaseDateTo(null)
    void setLastUpdatedFrom(null)
    void setLastUpdatedTo(null)
    void setCostInputMin(null)
    void setCostInputMax(null)
    void setCostOutputMin(null)
    void setCostOutputMax(null)
    void setCostCacheReadMin(null)
    void setCostCacheReadMax(null)
    void setCostCacheWriteMin(null)
    void setCostCacheWriteMax(null)
    void setCostOver200kInputMin(null)
    void setCostOver200kInputMax(null)
    void setCostOver200kOutputMin(null)
    void setCostOver200kOutputMax(null)
    void setCostOver200kCacheReadMin(null)
    void setCostOver200kCacheReadMax(null)
    void setContextLimitMin(null)
    void setContextLimitMax(null)
    void setInputLimitMin(null)
    void setInputLimitMax(null)
    void setOutputLimitMin(null)
    void setOutputLimitMax(null)
  }, [
    setSearch,
    setProviders,
    setFamilies,
    setModalities,
    setStatus,
    setOpenWeights,
    setReasoning,
    setToolCall,
    setAttachment,
    setStructuredOutput,
    setKnowledgeQuery,
    setReleaseDateFrom,
    setReleaseDateTo,
    setLastUpdatedFrom,
    setLastUpdatedTo,
    setCostInputMin,
    setCostInputMax,
    setCostOutputMin,
    setCostOutputMax,
    setCostCacheReadMin,
    setCostCacheReadMax,
    setCostCacheWriteMin,
    setCostCacheWriteMax,
    setCostOver200kInputMin,
    setCostOver200kInputMax,
    setCostOver200kOutputMin,
    setCostOver200kOutputMax,
    setCostOver200kCacheReadMin,
    setCostOver200kCacheReadMax,
    setContextLimitMin,
    setContextLimitMax,
    setInputLimitMin,
    setInputLimitMax,
    setOutputLimitMin,
    setOutputLimitMax,
  ])

  const activeCount =
    filters.providers.length +
    filters.families.length +
    filters.status.length +
    (filters.openWeights !== null ? 1 : 0) +
    (filters.reasoning !== null ? 1 : 0) +
    (filters.toolCall !== null ? 1 : 0) +
    (filters.attachment !== null ? 1 : 0) +
    (filters.structuredOutput !== null ? 1 : 0) +
    filters.modalities.length +
    (filters.knowledgeQuery !== null ? 1 : 0) +
    (filters.releaseDateFrom !== null || filters.releaseDateTo !== null
      ? 1
      : 0) +
    (filters.lastUpdatedFrom !== null || filters.lastUpdatedTo !== null
      ? 1
      : 0) +
    (filters.costInputMin !== null || filters.costInputMax !== null ? 1 : 0) +
    (filters.costOutputMin !== null || filters.costOutputMax !== null ? 1 : 0) +
    (filters.costCacheReadMin !== null || filters.costCacheReadMax !== null
      ? 1
      : 0) +
    (filters.costCacheWriteMin !== null || filters.costCacheWriteMax !== null
      ? 1
      : 0) +
    (filters.costOver200kInputMin !== null ||
    filters.costOver200kInputMax !== null
      ? 1
      : 0) +
    (filters.costOver200kOutputMin !== null ||
    filters.costOver200kOutputMax !== null
      ? 1
      : 0) +
    (filters.costOver200kCacheReadMin !== null ||
    filters.costOver200kCacheReadMax !== null
      ? 1
      : 0) +
    (filters.contextLimitMin !== null || filters.contextLimitMax !== null
      ? 1
      : 0) +
    (filters.inputLimitMin !== null || filters.inputLimitMax !== null ? 1 : 0) +
    (filters.outputLimitMin !== null || filters.outputLimitMax !== null ? 1 : 0)

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
    uniqueStatuses,
    activeCount,
    setProviders,
    setFamilies,
    setModalities,
    setStatus,
    setOpenWeights,
    setReasoning,
    setToolCall,
    setAttachment,
    setStructuredOutput,
    setKnowledgeQuery,
    setReleaseDateFrom,
    setReleaseDateTo,
    setLastUpdatedFrom,
    setLastUpdatedTo,
    setCostInputMin,
    setCostInputMax,
    setCostOutputMin,
    setCostOutputMax,
    setCostCacheReadMin,
    setCostCacheReadMax,
    setCostCacheWriteMin,
    setCostCacheWriteMax,
    setCostOver200kInputMin,
    setCostOver200kInputMax,
    setCostOver200kOutputMin,
    setCostOver200kOutputMax,
    setCostOver200kCacheReadMin,
    setCostOver200kCacheReadMax,
    setContextLimitMin,
    setContextLimitMax,
    setInputLimitMin,
    setInputLimitMax,
    setOutputLimitMin,
    setOutputLimitMax,
  }
}
