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
  const [costOver200kCacheWriteMinRaw, setCostOver200kCacheWriteMin] =
    useQueryState('costOver200kCacheWriteMin', parseAsFloat)
  const [costOver200kCacheWriteMaxRaw, setCostOver200kCacheWriteMax] =
    useQueryState('costOver200kCacheWriteMax', parseAsFloat)
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

  const [sort] = useQueryState('sort', parseAsString)
  const [dir] = useQueryState('dir', parseAsString)

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
  const costOver200kCacheWriteMin = costOver200kCacheWriteMinRaw ?? null
  const costOver200kCacheWriteMax = costOver200kCacheWriteMaxRaw ?? null
  const contextLimitMin = contextLimitMinRaw ?? null
  const contextLimitMax = contextLimitMaxRaw ?? null
  const inputLimitMin = inputLimitMinRaw ?? null
  const inputLimitMax = inputLimitMaxRaw ?? null
  const outputLimitMin = outputLimitMinRaw ?? null
  const outputLimitMax = outputLimitMaxRaw ?? null

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
      result = result.filter(
        (m) => m.costInput != null && m.costInput >= costInputMin
      )
    }
    if (costInputMax !== null) {
      result = result.filter(
        (m) => m.costInput != null && m.costInput <= costInputMax
      )
    }
    if (costOutputMin !== null) {
      result = result.filter(
        (m) => m.costOutput != null && m.costOutput >= costOutputMin
      )
    }
    if (costOutputMax !== null) {
      result = result.filter(
        (m) => m.costOutput != null && m.costOutput <= costOutputMax
      )
    }
    if (costCacheReadMin !== null) {
      result = result.filter(
        (m) => m.costCacheRead != null && m.costCacheRead >= costCacheReadMin
      )
    }
    if (costCacheReadMax !== null) {
      result = result.filter(
        (m) => m.costCacheRead != null && m.costCacheRead <= costCacheReadMax
      )
    }
    if (costCacheWriteMin !== null) {
      result = result.filter(
        (m) => m.costCacheWrite != null && m.costCacheWrite >= costCacheWriteMin
      )
    }
    if (costCacheWriteMax !== null) {
      result = result.filter(
        (m) => m.costCacheWrite != null && m.costCacheWrite <= costCacheWriteMax
      )
    }
    if (costOver200kInputMin !== null) {
      result = result.filter((m) =>
        m.costOver200kInput
          ? m.costOver200kInput >= costOver200kInputMin
          : false
      )
    }
    if (costOver200kInputMax !== null) {
      result = result.filter((m) =>
        m.costOver200kInput
          ? m.costOver200kInput <= costOver200kInputMax
          : false
      )
    }
    if (costOver200kOutputMin !== null) {
      result = result.filter((m) =>
        m.costOver200kOutput
          ? m.costOver200kOutput >= costOver200kOutputMin
          : false
      )
    }
    if (costOver200kOutputMax !== null) {
      result = result.filter((m) =>
        m.costOver200kOutput
          ? m.costOver200kOutput <= costOver200kOutputMax
          : false
      )
    }
    if (costOver200kCacheReadMin !== null) {
      result = result.filter((m) =>
        m.costOver200kCacheRead
          ? m.costOver200kCacheRead >= costOver200kCacheReadMin
          : false
      )
    }
    if (costOver200kCacheReadMax !== null) {
      result = result.filter((m) =>
        m.costOver200kCacheRead
          ? m.costOver200kCacheRead <= costOver200kCacheReadMax
          : false
      )
    }
    if (costOver200kCacheWriteMin !== null) {
      result = result.filter((m) =>
        m.costOver200kCacheWrite
          ? m.costOver200kCacheWrite >= costOver200kCacheWriteMin
          : false
      )
    }
    if (costOver200kCacheWriteMax !== null) {
      result = result.filter((m) =>
        m.costOver200kCacheWrite
          ? m.costOver200kCacheWrite <= costOver200kCacheWriteMax
          : false
      )
    }
    if (contextLimitMin !== null) {
      result = result.filter((m) =>
        m.contextLimit != null ? m.contextLimit >= contextLimitMin : false
      )
    }
    if (contextLimitMax !== null) {
      result = result.filter((m) =>
        m.contextLimit != null ? m.contextLimit <= contextLimitMax : false
      )
    }
    if (inputLimitMin !== null) {
      result = result.filter((m) =>
        m.inputLimit != null ? m.inputLimit >= inputLimitMin : false
      )
    }
    if (inputLimitMax !== null) {
      result = result.filter((m) =>
        m.inputLimit != null ? m.inputLimit <= inputLimitMax : false
      )
    }
    if (outputLimitMin !== null) {
      result = result.filter((m) =>
        m.outputLimit != null ? m.outputLimit >= outputLimitMin : false
      )
    }
    if (outputLimitMax !== null) {
      result = result.filter((m) =>
        m.outputLimit != null ? m.outputLimit <= outputLimitMax : false
      )
    }

    if (sort && (dir === 'asc' || dir === 'desc')) {
      result = [...result].sort((a, b) => {
        const aVal = a[sort as keyof FlatModel]
        const bVal = b[sort as keyof FlatModel]

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return dir === 'asc' ? aVal - bVal : bVal - aVal
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return dir === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          if (aVal === bVal) return 0
          return dir === 'asc' ? (aVal ? 1 : -1) : aVal ? -1 : 1
        }
        if (Array.isArray(aVal) && Array.isArray(bVal)) {
          const aStr = aVal.join(',')
          const bStr = bVal.join(',')
          return dir === 'asc'
            ? aStr.localeCompare(bStr)
            : bStr.localeCompare(aStr)
        }
        return 0
      })
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
    costOver200kCacheWriteMin,
    costOver200kCacheWriteMax,
    contextLimitMin,
    contextLimitMax,
    inputLimitMin,
    inputLimitMax,
    outputLimitMin,
    outputLimitMax,
    sort,
    dir,
  ])

  const activeCount =
    providers.length +
    families.length +
    status.length +
    (openWeights !== null ? 1 : 0) +
    (reasoning !== null ? 1 : 0) +
    (toolCall !== null ? 1 : 0) +
    (attachment !== null ? 1 : 0) +
    (structuredOutput !== null ? 1 : 0) +
    modalities.length +
    (knowledgeQuery !== null ? 1 : 0) +
    (releaseDateFrom !== null || releaseDateTo !== null ? 1 : 0) +
    (lastUpdatedFrom !== null || lastUpdatedTo !== null ? 1 : 0) +
    (costInputMin !== null || costInputMax !== null ? 1 : 0) +
    (costOutputMin !== null || costOutputMax !== null ? 1 : 0) +
    (costCacheReadMin !== null || costCacheReadMax !== null ? 1 : 0) +
    (costCacheWriteMin !== null || costCacheWriteMax !== null ? 1 : 0) +
    (costOver200kInputMin !== null || costOver200kInputMax !== null ? 1 : 0) +
    (costOver200kOutputMin !== null || costOver200kOutputMax !== null ? 1 : 0) +
    (costOver200kCacheReadMin !== null || costOver200kCacheReadMax !== null
      ? 1
      : 0) +
    (costOver200kCacheWriteMin !== null || costOver200kCacheWriteMax !== null
      ? 1
      : 0) +
    (contextLimitMin !== null || contextLimitMax !== null ? 1 : 0) +
    (inputLimitMin !== null || inputLimitMax !== null ? 1 : 0) +
    (outputLimitMin !== null || outputLimitMax !== null ? 1 : 0)

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
    void setCostOver200kCacheWriteMin(null)
    void setCostOver200kCacheWriteMax(null)
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
    setCostOver200kCacheWriteMin,
    setCostOver200kCacheWriteMax,
    setContextLimitMin,
    setContextLimitMax,
    setInputLimitMin,
    setInputLimitMax,
    setOutputLimitMin,
    setOutputLimitMax,
  ])

  return {
    search,
    setSearch,
    filteredModels,
    activeCount,
    resetFilters,
  }
}
