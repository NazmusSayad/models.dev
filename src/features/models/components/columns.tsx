/* eslint-disable max-lines */

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  FilterIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ColumnDef, HeaderContext } from '@tanstack/react-table'
import { FlatModel } from '../helpers/data'
import { FilterState } from '../helpers/use-model-data'

function formatCost(n: number) {
  if (n === 0) return 'Free'
  if (n < 0.01) return `$${n.toFixed(4)}`
  if (n < 1) return `$${n.toFixed(2)}`
  return `$${n.toFixed(2)}`
}

function formatNumber(n: number) {
  if (n === 0) return '-'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function providerHue(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function statusHue(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 142
    case 'deprecated':
      return 0
    case 'beta':
      return 38
    default:
      return 215
  }
}

function BooleanCell({ value }: { value: boolean }) {
  return value ? (
    <HugeiconsIcon
      icon={CheckmarkCircle01Icon}
      className="h-4 w-4 text-emerald-500"
    />
  ) : (
    <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4 text-red-400" />
  )
}

/* ------------------------------------------------------------------ */
/*  ColumnHeader with embedded filter                                  */
/* ------------------------------------------------------------------ */

function SortArrow({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (!sorted) return null
  return (
    <span className="ml-1 text-[10px] opacity-60">
      {sorted === 'asc' ? '↑' : '↓'}
    </span>
  )
}

function FilterHeader({
  label,
  active,
  children,
  onSort,
  sorted,
}: {
  label: string
  active: boolean
  children: React.ReactNode
  onSort?: (event: unknown) => void
  sorted: false | 'asc' | 'desc'
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onSort}
        className="hover:text-foreground flex items-center truncate text-xs font-semibold tracking-wider whitespace-nowrap uppercase select-none"
      >
        {label}
        <SortArrow sorted={sorted} />
      </button>
      <Popover modal={false}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded transition-colors',
              active
                ? 'text-primary bg-primary/10 opacity-100'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100'
            )}
          >
            <HugeiconsIcon icon={FilterIcon} className="h-3 w-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="start">
          {children}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function CheckboxFilterList({
  values,
  options,
  onToggle,
}: {
  values: string[]
  options: { id: string; label: string }[]
  onToggle: (id: string) => void
}) {
  return (
    <ScrollArea className="h-64">
      <div className="space-y-0.5 p-2">
        {options.map((opt) => (
          <label
            key={opt.id}
            className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm"
          >
            <Checkbox
              checked={values.includes(opt.id)}
              onCheckedChange={() => onToggle(opt.id)}
            />
            <span className="truncate">{opt.label}</span>
          </label>
        ))}
      </div>
    </ScrollArea>
  )
}

function BooleanFilterPopover({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="space-y-1 p-2">
      <Button
        variant={value === true ? 'default' : 'outline'}
        size="sm"
        className="h-7 w-full text-xs"
        onClick={() => onChange(value === true ? null : true)}
      >
        Yes
      </Button>
      <Button
        variant={value === false ? 'default' : 'outline'}
        size="sm"
        className="h-7 w-full text-xs"
        onClick={() => onChange(value === false ? null : false)}
      >
        No
      </Button>
    </div>
  )
}

function RangeFilterPopover({
  min,
  max,
  onChange,
}: {
  min: number | null
  max: number | null
  onChange: (min: number | null, max: number | null) => void
}) {
  return (
    <div className="space-y-2 p-2">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Min"
          min={0}
          step="any"
          value={min ?? ''}
          onChange={(e) => {
            const val = e.target.value
            const num = val === '' ? null : Number(val)
            onChange(num !== null && isNaN(num) ? min : num, max)
          }}
        />
        <span className="text-muted-foreground text-xs">-</span>
        <Input
          type="number"
          placeholder="Max"
          min={0}
          step="any"
          value={max ?? ''}
          onChange={(e) => {
            const val = e.target.value
            const num = val === '' ? null : Number(val)
            onChange(min, num !== null && isNaN(num) ? max : num)
          }}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-7 w-full text-xs"
        onClick={() => onChange(null, null)}
      >
        Clear
      </Button>
    </div>
  )
}

function TextFilterPopover({
  value,
  onChange,
  placeholder,
}: {
  value: string | null
  onChange: (v: string | null) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2 p-2">
      <Input
        type="text"
        placeholder={placeholder || 'Search...'}
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value
          onChange(val.trim() ? val : null)
        }}
      />
      <Button
        variant="outline"
        size="sm"
        className="h-7 w-full text-xs"
        onClick={() => onChange(null)}
      >
        Clear
      </Button>
    </div>
  )
}

function DateRangeFilterPopover({
  from,
  to,
  onChange,
}: {
  from: string | null
  to: string | null
  onChange: (from: string | null, to: string | null) => void
}) {
  return (
    <div className="space-y-2 p-2">
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs">From</label>
        <Input
          type="date"
          value={from ?? ''}
          onChange={(e) => {
            const val = e.target.value
            onChange(val || null, to)
          }}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs">To</label>
        <Input
          type="date"
          value={to ?? ''}
          onChange={(e) => {
            const val = e.target.value
            onChange(from, val || null)
          }}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-7 w-full text-xs"
        onClick={() => onChange(null, null)}
      >
        Clear
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  useColumns hook                                                    */
/* ------------------------------------------------------------------ */

export interface UseColumnsProps {
  filters: FilterState
  setProviders: (v: string[] | null) => void
  setFamilies: (v: string[] | null) => void
  setModalities: (v: string[] | null) => void
  setStatus: (v: string[] | null) => void
  setOpenWeights: (v: boolean | null) => void
  setReasoning: (v: boolean | null) => void
  setToolCall: (v: boolean | null) => void
  setAttachment: (v: boolean | null) => void
  setStructuredOutput: (v: boolean | null) => void
  setCostInputMin: (v: number | null) => void
  setCostInputMax: (v: number | null) => void
  setCostOutputMin: (v: number | null) => void
  setCostOutputMax: (v: number | null) => void
  setCostCacheReadMin: (v: number | null) => void
  setCostCacheReadMax: (v: number | null) => void
  setCostCacheWriteMin: (v: number | null) => void
  setCostCacheWriteMax: (v: number | null) => void
  setCostOver200kInputMin: (v: number | null) => void
  setCostOver200kInputMax: (v: number | null) => void
  setCostOver200kOutputMin: (v: number | null) => void
  setCostOver200kOutputMax: (v: number | null) => void
  setCostOver200kCacheReadMin: (v: number | null) => void
  setCostOver200kCacheReadMax: (v: number | null) => void
  setContextLimitMin: (v: number | null) => void
  setContextLimitMax: (v: number | null) => void
  setInputLimitMin: (v: number | null) => void
  setInputLimitMax: (v: number | null) => void
  setOutputLimitMin: (v: number | null) => void
  setOutputLimitMax: (v: number | null) => void
  setKnowledgeQuery: (v: string | null) => void
  setReleaseDateFrom: (v: string | null) => void
  setReleaseDateTo: (v: string | null) => void
  setLastUpdatedFrom: (v: string | null) => void
  setLastUpdatedTo: (v: string | null) => void
  uniqueProviders: [string, string][]
  uniqueFamilies: string[]
  uniqueModalities: string[]
  uniqueStatuses: string[]
}

export function useColumns({
  filters,
  setProviders,
  setFamilies,
  setModalities,
  setStatus,
  setOpenWeights,
  setReasoning,
  setToolCall,
  setAttachment,
  setStructuredOutput,
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
  setKnowledgeQuery,
  setReleaseDateFrom,
  setReleaseDateTo,
  setLastUpdatedFrom,
  setLastUpdatedTo,
  uniqueProviders,
  uniqueFamilies,
  uniqueModalities,
  uniqueStatuses,
}: UseColumnsProps): ColumnDef<FlatModel>[] {
  function toggleArray(
    arr: string[],
    value: string,
    setter: (v: string[] | null) => void
  ) {
    const exists = arr.includes(value)
    const next = exists ? arr.filter((v) => v !== value) : [...arr, value]
    setter(next.length > 0 ? next : null)
  }

  return [
    {
      accessorKey: 'providerName',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Provider"
          active={filters.providers.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.providers}
            options={uniqueProviders.map(([id, name]) => ({ id, label: name }))}
            onToggle={(v) => toggleArray(filters.providers, v, setProviders)}
          />
        </FilterHeader>
      ),
      size: 185,
      cell: ({ row }) => {
        const name = row.original.providerName
        const hue = providerHue(name)
        return (
          <Badge
            variant="secondary"
            className="text-xs font-medium"
            style={{
              backgroundColor: `hsl(${hue} 70% 92%)`,
              color: `hsl(${hue} 80% 25%)`,
              borderColor: `hsl(${hue} 60% 80%)`,
            }}
          >
            {name}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <div
          onClick={column.getToggleSortingHandler()}
          className="hover:text-foreground flex cursor-pointer items-center truncate text-xs font-semibold tracking-wider whitespace-nowrap uppercase select-none"
        >
          Model
          <SortArrow sorted={column.getIsSorted()} />
        </div>
      ),
      size: 300,
      cell: ({ row }) => (
        <span className="text-foreground text-sm font-medium">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'family',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Family"
          active={filters.families.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.families}
            options={uniqueFamilies.map((f) => ({ id: f, label: f }))}
            onToggle={(v) => toggleArray(filters.families, v, setFamilies)}
          />
        </FilterHeader>
      ),
      size: 150,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.family}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Status"
          active={filters.status.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.status}
            options={uniqueStatuses.map((s) => ({ id: s, label: s }))}
            onToggle={(v) => toggleArray(filters.status, v, setStatus)}
          />
        </FilterHeader>
      ),
      size: 130,
      cell: ({ row }) => {
        const status = row.original.status
        const hue = statusHue(status)
        return (
          <Badge
            variant="secondary"
            className="text-xs font-medium"
            style={{
              backgroundColor: `hsl(${hue} 70% 92%)`,
              color: `hsl(${hue} 80% 25%)`,
              borderColor: `hsl(${hue} 60% 80%)`,
            }}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'costInput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Input Cost"
          active={
            filters.costInputMin !== null || filters.costInputMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.costInputMin}
            max={filters.costInputMax}
            onChange={(min, max) => {
              void setCostInputMin(min)
              void setCostInputMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 140,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costInput)}
        </span>
      ),
    },
    {
      accessorKey: 'costOutput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Output Cost"
          active={
            filters.costOutputMin !== null || filters.costOutputMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.costOutputMin}
            max={filters.costOutputMax}
            onChange={(min, max) => {
              void setCostOutputMin(min)
              void setCostOutputMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 150,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costOutput)}
        </span>
      ),
    },
    {
      accessorKey: 'costCacheRead',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Cache Read"
          active={
            filters.costCacheReadMin !== null ||
            filters.costCacheReadMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.costCacheReadMin}
            max={filters.costCacheReadMax}
            onChange={(min, max) => {
              void setCostCacheReadMin(min)
              void setCostCacheReadMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 140,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costCacheRead)}
        </span>
      ),
    },
    {
      accessorKey: 'costCacheWrite',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Cache Write"
          active={
            filters.costCacheWriteMin !== null ||
            filters.costCacheWriteMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.costCacheWriteMin}
            max={filters.costCacheWriteMax}
            onChange={(min, max) => {
              void setCostCacheWriteMin(min)
              void setCostCacheWriteMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 150,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costCacheWrite)}
        </span>
      ),
    },
    {
      accessorKey: 'costOver200kInput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label=">200k Input"
          active={
            filters.costOver200kInputMin !== null ||
            filters.costOver200kInputMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.costOver200kInputMin}
            max={filters.costOver200kInputMax}
            onChange={(min, max) => {
              void setCostOver200kInputMin(min)
              void setCostOver200kInputMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 160,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costOver200kInput)}
        </span>
      ),
    },
    {
      accessorKey: 'costOver200kOutput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label=">200k Output"
          active={
            filters.costOver200kOutputMin !== null ||
            filters.costOver200kOutputMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.costOver200kOutputMin}
            max={filters.costOver200kOutputMax}
            onChange={(min, max) => {
              void setCostOver200kOutputMin(min)
              void setCostOver200kOutputMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 160,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costOver200kOutput)}
        </span>
      ),
    },
    {
      accessorKey: 'costOver200kCacheRead',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label=">200k Cache"
          active={
            filters.costOver200kCacheReadMin !== null ||
            filters.costOver200kCacheReadMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.costOver200kCacheReadMin}
            max={filters.costOver200kCacheReadMax}
            onChange={(min, max) => {
              void setCostOver200kCacheReadMin(min)
              void setCostOver200kCacheReadMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 160,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costOver200kCacheRead)}
        </span>
      ),
    },
    {
      accessorKey: 'contextLimit',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Context"
          active={
            filters.contextLimitMin !== null || filters.contextLimitMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.contextLimitMin}
            max={filters.contextLimitMax}
            onChange={(min, max) => {
              void setContextLimitMin(min)
              void setContextLimitMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 130,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatNumber(row.original.contextLimit)}
        </span>
      ),
    },
    {
      accessorKey: 'inputLimit',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Input Context"
          active={
            filters.inputLimitMin !== null || filters.inputLimitMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.inputLimitMin}
            max={filters.inputLimitMax}
            onChange={(min, max) => {
              void setInputLimitMin(min)
              void setInputLimitMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 160,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatNumber(row.original.inputLimit)}
        </span>
      ),
    },
    {
      accessorKey: 'outputLimit',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Output Context"
          active={
            filters.outputLimitMin !== null || filters.outputLimitMax !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <RangeFilterPopover
            min={filters.outputLimitMin}
            max={filters.outputLimitMax}
            onChange={(min, max) => {
              void setOutputLimitMin(min)
              void setOutputLimitMax(max)
            }}
          />
        </FilterHeader>
      ),
      size: 160,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatNumber(row.original.outputLimit)}
        </span>
      ),
    },
    {
      accessorKey: 'knowledge',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Knowledge"
          active={filters.knowledgeQuery !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <TextFilterPopover
            value={filters.knowledgeQuery}
            onChange={setKnowledgeQuery}
            placeholder="Search knowledge..."
          />
        </FilterHeader>
      ),
      size: 175,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.knowledge || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'release_date',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Released"
          active={
            filters.releaseDateFrom !== null || filters.releaseDateTo !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <DateRangeFilterPopover
            from={filters.releaseDateFrom}
            to={filters.releaseDateTo}
            onChange={(from, to) => {
              void setReleaseDateFrom(from)
              void setReleaseDateTo(to)
            }}
          />
        </FilterHeader>
      ),
      size: 165,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.release_date)}
        </span>
      ),
    },
    {
      accessorKey: 'last_updated',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Updated"
          active={
            filters.lastUpdatedFrom !== null || filters.lastUpdatedTo !== null
          }
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <DateRangeFilterPopover
            from={filters.lastUpdatedFrom}
            to={filters.lastUpdatedTo}
            onChange={(from, to) => {
              void setLastUpdatedFrom(from)
              void setLastUpdatedTo(to)
            }}
          />
        </FilterHeader>
      ),
      size: 165,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.last_updated)}
        </span>
      ),
    },
    {
      accessorKey: 'modalitiesInput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Input"
          active={filters.modalities.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.modalities}
            options={uniqueModalities.map((m) => ({ id: m, label: m }))}
            onToggle={(v) => toggleArray(filters.modalities, v, setModalities)}
          />
        </FilterHeader>
      ),
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.modalitiesInput.map((m) => (
            <Badge
              key={m}
              variant="secondary"
              className="px-1.5 py-0 text-[10px]"
            >
              {m}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'modalitiesOutput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Output"
          active={filters.modalities.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.modalities}
            options={uniqueModalities.map((m) => ({ id: m, label: m }))}
            onToggle={(v) => toggleArray(filters.modalities, v, setModalities)}
          />
        </FilterHeader>
      ),
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.modalitiesOutput.map((m) => (
            <Badge
              key={m}
              variant="outline"
              className="px-1.5 py-0 text-[10px]"
            >
              {m}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'open_weights',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Open"
          active={filters.openWeights !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.openWeights}
            onChange={setOpenWeights}
          />
        </FilterHeader>
      ),
      size: 120,
      cell: ({ row }) => <BooleanCell value={row.original.open_weights} />,
    },
    {
      accessorKey: 'reasoning',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Reason"
          active={filters.reasoning !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.reasoning}
            onChange={setReasoning}
          />
        </FilterHeader>
      ),
      size: 120,
      cell: ({ row }) => <BooleanCell value={row.original.reasoning} />,
    },
    {
      accessorKey: 'tool_call',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Tools"
          active={filters.toolCall !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.toolCall}
            onChange={setToolCall}
          />
        </FilterHeader>
      ),
      size: 120,
      cell: ({ row }) => <BooleanCell value={row.original.tool_call} />,
    },
    {
      accessorKey: 'attachment',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Attachment"
          active={filters.attachment !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.attachment}
            onChange={setAttachment}
          />
        </FilterHeader>
      ),
      size: 150,
      cell: ({ row }) => <BooleanCell value={row.original.attachment} />,
    },
    {
      accessorKey: 'structuredOutput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Structured"
          active={filters.structuredOutput !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.structuredOutput}
            onChange={setStructuredOutput}
          />
        </FilterHeader>
      ),
      size: 160,
      cell: ({ row }) => <BooleanCell value={row.original.structuredOutput} />,
    },
  ]
}
