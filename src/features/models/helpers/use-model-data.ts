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

function inNumberRange(
  value: number | null | undefined,
  min: number | null,
  max: number | null
) {
  if (min !== null && (value == null || value < min)) return false
  if (max !== null && (value == null || value > max)) return false
  return true
}

function matchesText(value: string | undefined, query: string | null) {
  if (query === null || !query.trim()) return true
  return value?.toLowerCase().includes(query.toLowerCase()) ?? false
}

function matchesDate(
  value: string | undefined,
  from: string | null,
  to: string | null
) {
  if (from !== null && (!value || value < from)) return false
  if (to !== null && (!value || value > to)) return false
  return true
}

function matchesSelection(value: string, selection: string[]) {
  return selection.length === 0 || selection.includes(value)
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
  const [types, setTypes] = useQueryState(
    'type',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [status, setStatus] = useQueryState(
    'status',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [reasoningOptions, setReasoningOptions] = useQueryState(
    'reasoningOptions',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [modalitiesInput, setModalitiesInput] = useQueryState(
    'modalitiesInput',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [modalitiesOutput, setModalitiesOutput] = useQueryState(
    'modalitiesOutput',
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [openWeights, setOpenWeights] = useQueryState(
    'openWeights',
    parseAsBoolean
  )
  const [reasoning, setReasoning] = useQueryState('reasoning', parseAsBoolean)
  const [toolCall, setToolCall] = useQueryState('toolCall', parseAsBoolean)
  const [attachment, setAttachment] = useQueryState(
    'attachment',
    parseAsBoolean
  )
  const [structuredOutput, setStructuredOutput] = useQueryState(
    'structuredOutput',
    parseAsBoolean
  )
  const [temperature, setTemperature] = useQueryState(
    'temperature',
    parseAsBoolean
  )
  const [free, setFree] = useQueryState('free', parseAsBoolean)
  const [tiered, setTiered] = useQueryState('tiered', parseAsBoolean)
  const [interleaved, setInterleaved] = useQueryState(
    'interleaved',
    parseAsBoolean
  )

  const [knowledgeQuery, setKnowledgeQuery] = useQueryState(
    'knowledgeQuery',
    parseAsString
  )
  const [descriptionQuery, setDescriptionQuery] = useQueryState(
    'descriptionQuery',
    parseAsString
  )
  const [canonicalQuery, setCanonicalQuery] = useQueryState(
    'canonicalQuery',
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

  const [costInputMin, setCostInputMin] = useQueryState(
    'costInputMin',
    parseAsFloat
  )
  const [costInputMax, setCostInputMax] = useQueryState(
    'costInputMax',
    parseAsFloat
  )
  const [costOutputMin, setCostOutputMin] = useQueryState(
    'costOutputMin',
    parseAsFloat
  )
  const [costOutputMax, setCostOutputMax] = useQueryState(
    'costOutputMax',
    parseAsFloat
  )
  const [costCacheReadMin, setCostCacheReadMin] = useQueryState(
    'costCacheReadMin',
    parseAsFloat
  )
  const [costCacheReadMax, setCostCacheReadMax] = useQueryState(
    'costCacheReadMax',
    parseAsFloat
  )
  const [costCacheWriteMin, setCostCacheWriteMin] = useQueryState(
    'costCacheWriteMin',
    parseAsFloat
  )
  const [costCacheWriteMax, setCostCacheWriteMax] = useQueryState(
    'costCacheWriteMax',
    parseAsFloat
  )
  const [costOver200kInputMin, setCostOver200kInputMin] = useQueryState(
    'costOver200kInputMin',
    parseAsFloat
  )
  const [costOver200kInputMax, setCostOver200kInputMax] = useQueryState(
    'costOver200kInputMax',
    parseAsFloat
  )
  const [costOver200kOutputMin, setCostOver200kOutputMin] = useQueryState(
    'costOver200kOutputMin',
    parseAsFloat
  )
  const [costOver200kOutputMax, setCostOver200kOutputMax] = useQueryState(
    'costOver200kOutputMax',
    parseAsFloat
  )
  const [costOver200kCacheReadMin, setCostOver200kCacheReadMin] = useQueryState(
    'costOver200kCacheReadMin',
    parseAsFloat
  )
  const [costOver200kCacheReadMax, setCostOver200kCacheReadMax] = useQueryState(
    'costOver200kCacheReadMax',
    parseAsFloat
  )
  const [costOver200kCacheWriteMin, setCostOver200kCacheWriteMin] =
    useQueryState('costOver200kCacheWriteMin', parseAsFloat)
  const [costOver200kCacheWriteMax, setCostOver200kCacheWriteMax] =
    useQueryState('costOver200kCacheWriteMax', parseAsFloat)
  const [costReasoningMin, setCostReasoningMin] = useQueryState(
    'costReasoningMin',
    parseAsFloat
  )
  const [costReasoningMax, setCostReasoningMax] = useQueryState(
    'costReasoningMax',
    parseAsFloat
  )
  const [costInputAudioMin, setCostInputAudioMin] = useQueryState(
    'costInputAudioMin',
    parseAsFloat
  )
  const [costInputAudioMax, setCostInputAudioMax] = useQueryState(
    'costInputAudioMax',
    parseAsFloat
  )
  const [costOutputAudioMin, setCostOutputAudioMin] = useQueryState(
    'costOutputAudioMin',
    parseAsFloat
  )
  const [costOutputAudioMax, setCostOutputAudioMax] = useQueryState(
    'costOutputAudioMax',
    parseAsFloat
  )
  const [contextLimitMin, setContextLimitMin] = useQueryState(
    'contextLimitMin',
    parseAsInteger
  )
  const [contextLimitMax, setContextLimitMax] = useQueryState(
    'contextLimitMax',
    parseAsInteger
  )
  const [inputLimitMin, setInputLimitMin] = useQueryState(
    'inputLimitMin',
    parseAsInteger
  )
  const [inputLimitMax, setInputLimitMax] = useQueryState(
    'inputLimitMax',
    parseAsInteger
  )
  const [outputLimitMin, setOutputLimitMin] = useQueryState(
    'outputLimitMin',
    parseAsInteger
  )
  const [outputLimitMax, setOutputLimitMax] = useQueryState(
    'outputLimitMax',
    parseAsInteger
  )

  const [sort] = useQueryState('sort', parseAsString)
  const [dir] = useQueryState('dir', parseAsString)

  const fuse = useMemo(() => {
    return new Fuse(models, {
      keys: [
        'id',
        'name',
        'family',
        'providerId',
        'providerName',
        'description',
        'canonicalModelId',
        'type',
      ],
      threshold: 0.3,
      ignoreLocation: true,
    })
  }, [models])

  const filteredModels = useMemo(() => {
    let result = models

    if (deferredSearch.trim()) {
      const hits = fuse.search(deferredSearch.trim())
      result = hits.map((hit) => hit.item)
    }

    result = result.filter((model) => {
      if (!matchesSelection(model.providerId, providers)) return false
      if (!matchesSelection(model.family, families)) return false
      if (!matchesSelection(model.type, types)) return false
      if (status.length === 0) {
        if (model.status === 'deprecated') return false
      } else if (!status.includes(model.status)) {
        return false
      }
      if (
        reasoningOptions.length > 0 &&
        !model.reasoningOptions.some((option) =>
          reasoningOptions.includes(option)
        )
      ) {
        return false
      }
      if (
        modalitiesInput.length > 0 &&
        !model.modalitiesInput.some((modality) =>
          modalitiesInput.includes(modality)
        )
      ) {
        return false
      }
      if (
        modalitiesOutput.length > 0 &&
        !model.modalitiesOutput.some((modality) =>
          modalitiesOutput.includes(modality)
        )
      ) {
        return false
      }
      if (openWeights !== null && model.open_weights !== openWeights)
        return false
      if (reasoning !== null && model.reasoning !== reasoning) return false
      if (toolCall !== null && model.tool_call !== toolCall) return false
      if (attachment !== null && model.attachment !== attachment) return false
      if (
        structuredOutput !== null &&
        model.structuredOutput !== structuredOutput
      ) {
        return false
      }
      if (temperature !== null && model.temperature !== temperature)
        return false
      if (free !== null && model.isFree !== free) return false
      if (tiered !== null && model.tierCount > 0 !== tiered) return false
      if (interleaved !== null && Boolean(model.interleaved) !== interleaved) {
        return false
      }
      if (!matchesText(model.knowledge, knowledgeQuery)) return false
      if (!matchesText(model.description, descriptionQuery)) return false
      if (!matchesText(model.canonicalModelId, canonicalQuery)) return false
      if (!matchesDate(model.release_date, releaseDateFrom, releaseDateTo))
        return false
      if (!matchesDate(model.last_updated, lastUpdatedFrom, lastUpdatedTo))
        return false
      if (!inNumberRange(model.costInput, costInputMin, costInputMax))
        return false
      if (!inNumberRange(model.costOutput, costOutputMin, costOutputMax))
        return false
      if (
        !inNumberRange(model.costCacheRead, costCacheReadMin, costCacheReadMax)
      )
        return false
      if (
        !inNumberRange(
          model.costCacheWrite,
          costCacheWriteMin,
          costCacheWriteMax
        )
      )
        return false
      if (
        !inNumberRange(
          model.costOver200kInput,
          costOver200kInputMin,
          costOver200kInputMax
        )
      )
        return false
      if (
        !inNumberRange(
          model.costOver200kOutput,
          costOver200kOutputMin,
          costOver200kOutputMax
        )
      )
        return false
      if (
        !inNumberRange(
          model.costOver200kCacheRead,
          costOver200kCacheReadMin,
          costOver200kCacheReadMax
        )
      )
        return false
      if (
        !inNumberRange(
          model.costOver200kCacheWrite,
          costOver200kCacheWriteMin,
          costOver200kCacheWriteMax
        )
      )
        return false
      if (
        !inNumberRange(model.costReasoning, costReasoningMin, costReasoningMax)
      )
        return false
      if (
        !inNumberRange(
          model.costInputAudio,
          costInputAudioMin,
          costInputAudioMax
        )
      )
        return false
      if (
        !inNumberRange(
          model.costOutputAudio,
          costOutputAudioMin,
          costOutputAudioMax
        )
      )
        return false
      if (!inNumberRange(model.contextLimit, contextLimitMin, contextLimitMax))
        return false
      if (!inNumberRange(model.inputLimit, inputLimitMin, inputLimitMax))
        return false
      if (!inNumberRange(model.outputLimit, outputLimitMin, outputLimitMax))
        return false

      return true
    })

    if (sort && (dir === 'asc' || dir === 'desc')) {
      result = [...result].sort((a, b) => {
        const aValue = a[sort as keyof FlatModel]
        const bValue = b[sort as keyof FlatModel]

        if (typeof aValue === 'number' || typeof bValue === 'number') {
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return dir === 'asc' ? aValue - bValue : bValue - aValue
          }
          return typeof aValue === 'number' ? -1 : 1
        }
        if (typeof aValue === 'string' || typeof bValue === 'string') {
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return dir === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
          return typeof aValue === 'string' ? -1 : 1
        }
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          if (aValue === bValue) return 0
          return dir === 'asc' ? (aValue ? 1 : -1) : aValue ? -1 : 1
        }
        if (Array.isArray(aValue) && Array.isArray(bValue)) {
          const aString = aValue.join(',')
          const bString = bValue.join(',')
          return dir === 'asc'
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString)
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
    types,
    status,
    reasoningOptions,
    modalitiesInput,
    modalitiesOutput,
    openWeights,
    reasoning,
    toolCall,
    attachment,
    structuredOutput,
    temperature,
    free,
    tiered,
    interleaved,
    knowledgeQuery,
    descriptionQuery,
    canonicalQuery,
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
    costReasoningMin,
    costReasoningMax,
    costInputAudioMin,
    costInputAudioMax,
    costOutputAudioMin,
    costOutputAudioMax,
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
    types.length +
    status.length +
    reasoningOptions.length +
    modalitiesInput.length +
    modalitiesOutput.length +
    (openWeights !== null ? 1 : 0) +
    (reasoning !== null ? 1 : 0) +
    (toolCall !== null ? 1 : 0) +
    (attachment !== null ? 1 : 0) +
    (structuredOutput !== null ? 1 : 0) +
    (temperature !== null ? 1 : 0) +
    (free !== null ? 1 : 0) +
    (tiered !== null ? 1 : 0) +
    (interleaved !== null ? 1 : 0) +
    (knowledgeQuery !== null ? 1 : 0) +
    (descriptionQuery !== null ? 1 : 0) +
    (canonicalQuery !== null ? 1 : 0) +
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
    (costReasoningMin !== null || costReasoningMax !== null ? 1 : 0) +
    (costInputAudioMin !== null || costInputAudioMax !== null ? 1 : 0) +
    (costOutputAudioMin !== null || costOutputAudioMax !== null ? 1 : 0) +
    (contextLimitMin !== null || contextLimitMax !== null ? 1 : 0) +
    (inputLimitMin !== null || inputLimitMax !== null ? 1 : 0) +
    (outputLimitMin !== null || outputLimitMax !== null ? 1 : 0)

  const resetFilters = useCallback(() => {
    void setSearch(null)
    void setProviders(null)
    void setFamilies(null)
    void setTypes(null)
    void setStatus(null)
    void setReasoningOptions(null)
    void setModalitiesInput(null)
    void setModalitiesOutput(null)
    void setOpenWeights(null)
    void setReasoning(null)
    void setToolCall(null)
    void setAttachment(null)
    void setStructuredOutput(null)
    void setTemperature(null)
    void setFree(null)
    void setTiered(null)
    void setInterleaved(null)
    void setKnowledgeQuery(null)
    void setDescriptionQuery(null)
    void setCanonicalQuery(null)
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
    void setCostReasoningMin(null)
    void setCostReasoningMax(null)
    void setCostInputAudioMin(null)
    void setCostInputAudioMax(null)
    void setCostOutputAudioMin(null)
    void setCostOutputAudioMax(null)
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
    setTypes,
    setStatus,
    setReasoningOptions,
    setModalitiesInput,
    setModalitiesOutput,
    setOpenWeights,
    setReasoning,
    setToolCall,
    setAttachment,
    setStructuredOutput,
    setTemperature,
    setFree,
    setTiered,
    setInterleaved,
    setKnowledgeQuery,
    setDescriptionQuery,
    setCanonicalQuery,
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
    setCostReasoningMin,
    setCostReasoningMax,
    setCostInputAudioMin,
    setCostInputAudioMax,
    setCostOutputAudioMin,
    setCostOutputAudioMax,
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
