import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FilterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useMemo } from 'react'
import { FlatModel } from '../helpers/data'
import {
  BooleanFilter,
  DateRangeFilter,
  FilterOption,
  FilterSection,
  MultiSelectFilter,
  NumberRangeFilter,
  TextFilter,
} from './filter-controls'

function countOptions(
  models: FlatModel[],
  getValues: (model: FlatModel) => string[]
): FilterOption[] {
  const counts = new Map<string, number>()

  for (const model of models) {
    for (const value of getValues(model)) {
      if (!value) continue
      counts.set(value, (counts.get(value) || 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([id, count]) => ({ id, label: id, count }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

function providerOptions(models: FlatModel[]): FilterOption[] {
  const counts = new Map<string, FilterOption>()

  for (const model of models) {
    const existing = counts.get(model.providerId)
    if (existing) {
      existing.count = (existing.count || 0) + 1
    } else {
      counts.set(model.providerId, {
        id: model.providerId,
        label: model.providerName,
        count: 1,
      })
    }
  }

  return Array.from(counts.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  )
}

const reasoningOptionLabels: Record<string, string> = {
  effort: 'Effort',
  toggle: 'Toggle',
  budget_tokens: 'Budget tokens',
}

export function FiltersPopover({
  models,
  activeCount,
  onReset,
}: {
  models: FlatModel[]
  activeCount: number
  onReset: () => void
}) {
  const {
    providers,
    families,
    types,
    statuses,
    reasoningOptions,
    inputModalities,
    outputModalities,
  } = useMemo(
    () => ({
      providers: providerOptions(models),
      families: countOptions(models, (model) =>
        model.family ? [model.family] : []
      ),
      types: countOptions(models, (model) => [model.type]),
      statuses: countOptions(models, (model) => [model.status]).sort((a, b) => {
        const order = ['active', 'beta', 'alpha', 'deprecated']
        return order.indexOf(a.id) - order.indexOf(b.id)
      }),
      reasoningOptions: countOptions(models, (model) => [
        ...new Set(model.reasoningOptions),
      ]).map((option) => ({
        ...option,
        label: reasoningOptionLabels[option.id] || option.label,
      })),
      inputModalities: countOptions(models, (model) => model.modalitiesInput),
      outputModalities: countOptions(models, (model) => model.modalitiesOutput),
    }),
    [models]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5">
          <HugeiconsIcon icon={FilterIcon} className="h-4 w-4" />
          <span className="text-xs">Filters</span>
          {activeCount > 0 && (
            <span className="bg-muted text-muted-foreground ml-0.5 flex h-4 items-center rounded px-1 text-[10px]">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[440px] max-w-[calc(100vw-2rem)] p-0"
        align="end"
        collisionPadding={16}
      >
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div>
            <p className="text-sm font-medium">Filters</p>
            <p className="text-muted-foreground text-[10px]">
              {activeCount === 0
                ? 'No active filters'
                : `${activeCount} active`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onReset}
            disabled={activeCount === 0}
          >
            Clear all
          </Button>
        </div>

        <ScrollArea className="h-[min(70vh,640px)]">
          <div className="space-y-4 p-3">
            <FilterSection title="Model">
              <MultiSelectFilter
                label="Provider"
                param="providers"
                options={providers}
              />
              <MultiSelectFilter
                label="Family"
                param="families"
                options={families}
              />
              <MultiSelectFilter label="Type" param="type" options={types} />
              <MultiSelectFilter
                label="Status"
                param="status"
                options={statuses}
                emptyLabel="All except deprecated"
              />
              <TextFilter
                label="Knowledge"
                param="knowledgeQuery"
                placeholder="e.g. 2024-06"
              />
              <TextFilter
                label="Description"
                param="descriptionQuery"
                placeholder="Search description..."
              />
              <TextFilter
                label="Canonical ID"
                param="canonicalQuery"
                placeholder="e.g. openai/gpt-..."
              />
            </FilterSection>

            <FilterSection title="Pricing">
              <BooleanFilter
                label="Price"
                param="free"
                trueLabel="Free"
                falseLabel="Paid"
              />
              <BooleanFilter label="Tiered" param="tiered" />
              <NumberRangeFilter
                label="Input"
                minParam="costInputMin"
                maxParam="costInputMax"
              />
              <NumberRangeFilter
                label="Output"
                minParam="costOutputMin"
                maxParam="costOutputMax"
              />
              <NumberRangeFilter
                label="Cache read"
                minParam="costCacheReadMin"
                maxParam="costCacheReadMax"
              />
              <NumberRangeFilter
                label="Cache write"
                minParam="costCacheWriteMin"
                maxParam="costCacheWriteMax"
              />
              <NumberRangeFilter
                label="Reasoning"
                minParam="costReasoningMin"
                maxParam="costReasoningMax"
              />
              <NumberRangeFilter
                label="Audio in"
                minParam="costInputAudioMin"
                maxParam="costInputAudioMax"
              />
              <NumberRangeFilter
                label="Audio out"
                minParam="costOutputAudioMin"
                maxParam="costOutputAudioMax"
              />
            </FilterSection>

            <FilterSection title="Long Context Pricing">
              <NumberRangeFilter
                label=">200k input"
                minParam="costOver200kInputMin"
                maxParam="costOver200kInputMax"
              />
              <NumberRangeFilter
                label=">200k output"
                minParam="costOver200kOutputMin"
                maxParam="costOver200kOutputMax"
              />
              <NumberRangeFilter
                label=">200k cache read"
                minParam="costOver200kCacheReadMin"
                maxParam="costOver200kCacheReadMax"
              />
              <NumberRangeFilter
                label=">200k cache write"
                minParam="costOver200kCacheWriteMin"
                maxParam="costOver200kCacheWriteMax"
              />
            </FilterSection>

            <FilterSection title="Limits">
              <NumberRangeFilter
                label="Context"
                minParam="contextLimitMin"
                maxParam="contextLimitMax"
                integer
              />
              <NumberRangeFilter
                label="Input"
                minParam="inputLimitMin"
                maxParam="inputLimitMax"
                integer
              />
              <NumberRangeFilter
                label="Output"
                minParam="outputLimitMin"
                maxParam="outputLimitMax"
                integer
              />
            </FilterSection>

            <FilterSection title="Capabilities">
              <BooleanFilter label="Temperature" param="temperature" />
              <BooleanFilter label="Reasoning" param="reasoning" />
              <BooleanFilter label="Tools" param="toolCall" />
              <BooleanFilter label="Attachment" param="attachment" />
              <BooleanFilter label="Structured" param="structuredOutput" />
              <BooleanFilter label="Open weights" param="openWeights" />
              <MultiSelectFilter
                label="Input"
                param="modalitiesInput"
                options={inputModalities}
              />
              <MultiSelectFilter
                label="Output"
                param="modalitiesOutput"
                options={outputModalities}
              />
              <MultiSelectFilter
                label="Reasoning options"
                param="reasoningOptions"
                options={reasoningOptions}
              />
              <BooleanFilter label="Interleaved" param="interleaved" />
            </FilterSection>

            <FilterSection title="Dates">
              <DateRangeFilter
                label="Released"
                fromParam="releaseDateFrom"
                toParam="releaseDateTo"
              />
              <DateRangeFilter
                label="Updated"
                fromParam="lastUpdatedFrom"
                toParam="lastUpdatedTo"
              />
            </FilterSection>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
