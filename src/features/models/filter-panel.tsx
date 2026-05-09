'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Filter, RotateCcw } from 'lucide-react'
import { FilterState } from './use-model-data'

interface FilterPanelProps {
  filters: FilterState
  toggleArrayFilter: (
    key: 'providers' | 'families' | 'modalities',
    value: string
  ) => void
  toggleFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void
  resetFilters: () => void
  uniqueProviders: [string, string][]
  uniqueFamilies: string[]
  uniqueModalities: string[]
}

export function FilterPanel({
  filters,
  toggleArrayFilter,
  toggleFilter,
  resetFilters,
  uniqueProviders,
  uniqueFamilies,
  uniqueModalities,
}: FilterPanelProps) {
  const activeCount =
    filters.providers.length +
    filters.families.length +
    (filters.openWeights !== null ? 1 : 0) +
    (filters.reasoning !== null ? 1 : 0) +
    (filters.toolCall !== null ? 1 : 0) +
    (filters.attachment !== null ? 1 : 0) +
    filters.modalities.length

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-3.5 w-3.5" />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1 text-[10px]">
                {activeCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="max-h-[70vh] w-80 overflow-auto"
          align="start"
        >
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold">Providers</h4>
              <div className="max-h-40 space-y-1 overflow-auto pr-1">
                {uniqueProviders.map(([id, name]) => (
                  <label
                    key={id}
                    className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-1 text-sm"
                  >
                    <Checkbox
                      checked={filters.providers.includes(id)}
                      onCheckedChange={() => toggleArrayFilter('providers', id)}
                    />
                    <span className="truncate">{name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Families</h4>
              <div className="max-h-40 space-y-1 overflow-auto pr-1">
                {uniqueFamilies.map((family) => (
                  <label
                    key={family}
                    className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-1 text-sm"
                  >
                    <Checkbox
                      checked={filters.families.includes(family)}
                      onCheckedChange={() =>
                        toggleArrayFilter('families', family)
                      }
                    />
                    <span className="truncate">{family}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Modalities</h4>
              <div className="max-h-40 space-y-1 overflow-auto pr-1">
                {uniqueModalities.map((mod) => (
                  <label
                    key={mod}
                    className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-1 text-sm"
                  >
                    <Checkbox
                      checked={filters.modalities.includes(mod)}
                      onCheckedChange={() =>
                        toggleArrayFilter('modalities', mod)
                      }
                    />
                    <span className="truncate">{mod}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Capabilities</h4>
              <div className="space-y-1">
                <BooleanFilter
                  label="Open Weights"
                  value={filters.openWeights}
                  onChange={(v) => toggleFilter('openWeights', v)}
                />
                <BooleanFilter
                  label="Reasoning"
                  value={filters.reasoning}
                  onChange={(v) => toggleFilter('reasoning', v)}
                />
                <BooleanFilter
                  label="Tool Call"
                  value={filters.toolCall}
                  onChange={(v) => toggleFilter('toolCall', v)}
                />
                <BooleanFilter
                  label="Attachment"
                  value={filters.attachment}
                  onChange={(v) => toggleFilter('attachment', v)}
                />
              </div>
            </div>

            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-1"
                onClick={resetFilters}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset all
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={resetFilters}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  )
}

function BooleanFilter({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="flex items-center justify-between px-1 text-sm">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <Button
          variant={value === true ? 'default' : 'outline'}
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => onChange(value === true ? null : true)}
        >
          Yes
        </Button>
        <Button
          variant={value === false ? 'default' : 'outline'}
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => onChange(value === false ? null : false)}
        >
          No
        </Button>
      </div>
    </div>
  )
}
