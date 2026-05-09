/* eslint-disable max-lines */

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatNumberIntoHumanReadable } from '@/lib/number'
import { cn } from '@/lib/utils'
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  FilterIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'nuqs'
import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { ModelsContext } from '../contexts/column-context'

export function NumberValueRenderer({
  value,
  unit,
}: {
  value?: number | null
  unit: 'dollar' | 'number'
}) {
  if (value == null || Number.isNaN(value)) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  if (unit === 'dollar') {
    if (value === 0) {
      return <span className="text-muted-foreground text-sm">Free</span>
    }

    return (
      <span className="text-foreground text-sm font-thin tabular-nums">
        {value < 0.01
          ? `$${value.toFixed(4)}`
          : value < 1
            ? `$${value.toFixed(2)}`
            : `$${value.toFixed(2)}`}
      </span>
    )
  }

  if (unit === 'number') {
    if (value === 0) {
      return <span className="text-muted-foreground text-sm">0</span>
    }

    return (
      <span className="text-foreground text-sm font-thin tabular-nums">
        {formatNumberIntoHumanReadable(value)}
      </span>
    )
  }

  throw new Error('Invalid unit')
}

export function BooleanCell({ value }: { value: boolean }) {
  return value ? (
    <HugeiconsIcon
      icon={CheckmarkCircle01Icon}
      className="h-4 w-4 text-emerald-500"
    />
  ) : (
    <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4 text-red-400" />
  )
}

function SortArrow({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (!sorted) return null
  return (
    <span className="ml-1 text-[10px] opacity-60">
      {sorted === 'asc' ? '↑' : '↓'}
    </span>
  )
}

function FilterDropdownComponent({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Popover>
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
  )
}
const FilterDropdown = memo(FilterDropdownComponent)

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
  onSort?: () => void
  sorted: false | 'asc' | 'desc'
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onSort}
        className="hover:text-foreground flex items-center truncate text-xs font-medium tracking-wider whitespace-nowrap uppercase select-none"
      >
        {label}
        <SortArrow sorted={sorted} />
      </button>
      <FilterDropdown active={active}>{children}</FilterDropdown>
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
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  return (
    <div className="flex flex-col">
      <div className="border-b p-2">
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <ScrollArea className="h-64">
        <div className="w-full max-w-56 space-y-0.5 p-2">
          {filtered.map((opt) => (
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
          {filtered.length === 0 && (
            <p className="text-muted-foreground px-2 py-4 text-center text-xs">
              No results
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
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

function useColumnSort(columnKey: string) {
  const [sort, setSort] = useQueryState('sort', parseAsString)
  const [dir, setDir] = useQueryState('dir', parseAsString)

  const sorted: false | 'asc' | 'desc' =
    sort === columnKey && (dir === 'asc' || dir === 'desc') ? dir : false

  const toggleSort = useCallback(() => {
    if (sort !== columnKey) {
      void setSort(columnKey)
      void setDir('asc')
    } else if (dir === 'asc') {
      void setDir('desc')
    } else {
      void setSort(null)
      void setDir(null)
    }
  }, [sort, dir, columnKey, setSort, setDir])

  return { sorted, toggleSort }
}

export function ProviderHeader() {
  const models = useContext(ModelsContext)
  const [providers, setProviders] = useQueryState(
    'providers',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const { sorted, toggleSort } = useColumnSort('providerName')

  const options = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of models) map.set(m.providerId, m.providerName)
    return Array.from(map.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [models])

  function toggle(id: string) {
    const exists = providers.includes(id)
    const next = exists ? providers.filter((v) => v !== id) : [...providers, id]
    void setProviders(next.length > 0 ? next : null)
  }

  return (
    <FilterHeader
      label="Provider"
      active={providers.length > 0}
      sorted={sorted}
      onSort={toggleSort}
    >
      <CheckboxFilterList
        values={providers}
        options={options}
        onToggle={toggle}
      />
    </FilterHeader>
  )
}

export function ModelHeader() {
  const { sorted, toggleSort } = useColumnSort('name')
  return (
    <div
      onClick={toggleSort}
      className="hover:text-foreground flex cursor-pointer items-center truncate text-xs font-semibold tracking-wider whitespace-nowrap uppercase select-none"
    >
      Model
      <SortArrow sorted={sorted} />
    </div>
  )
}

export function FamilyHeader() {
  const models = useContext(ModelsContext)
  const [families, setFamilies] = useQueryState(
    'families',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const { sorted, toggleSort } = useColumnSort('family')

  const options = useMemo(() => {
    const set = new Set<string>()
    for (const m of models) if (m.family) set.add(m.family)
    return Array.from(set)
      .map((f) => ({ id: f, label: f }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [models])

  function toggle(id: string) {
    const exists = families.includes(id)
    const next = exists ? families.filter((v) => v !== id) : [...families, id]
    void setFamilies(next.length > 0 ? next : null)
  }

  return (
    <FilterHeader
      label="Family"
      active={families.length > 0}
      sorted={sorted}
      onSort={toggleSort}
    >
      <CheckboxFilterList
        values={families}
        options={options}
        onToggle={toggle}
      />
    </FilterHeader>
  )
}

export function StatusHeader() {
  const models = useContext(ModelsContext)
  const [status, setStatus] = useQueryState(
    'status',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const { sorted, toggleSort } = useColumnSort('status')

  const options = useMemo(() => {
    const set = new Set<string>()
    for (const m of models) set.add(m.status)
    return Array.from(set)
      .map((s) => ({ id: s, label: s }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [models])

  function toggle(id: string) {
    const exists = status.includes(id)
    const next = exists ? status.filter((v) => v !== id) : [...status, id]
    void setStatus(next.length > 0 ? next : null)
  }

  return (
    <FilterHeader
      label="Status"
      active={status.length > 0}
      sorted={sorted}
      onSort={toggleSort}
    >
      <CheckboxFilterList values={status} options={options} onToggle={toggle} />
    </FilterHeader>
  )
}

export function CostInputHeader() {
  const [min, setMin] = useQueryState('costInputMin', parseAsFloat)
  const [max, setMax] = useQueryState('costInputMax', parseAsFloat)
  const { sorted, toggleSort } = useColumnSort('costInput')

  return (
    <FilterHeader
      label="Input Cost"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function CostOutputHeader() {
  const [min, setMin] = useQueryState('costOutputMin', parseAsFloat)
  const [max, setMax] = useQueryState('costOutputMax', parseAsFloat)
  const { sorted, toggleSort } = useColumnSort('costOutput')

  return (
    <FilterHeader
      label="Output Cost"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function CostCacheReadHeader() {
  const [min, setMin] = useQueryState('costCacheReadMin', parseAsFloat)
  const [max, setMax] = useQueryState('costCacheReadMax', parseAsFloat)
  const { sorted, toggleSort } = useColumnSort('costCacheRead')

  return (
    <FilterHeader
      label="Cache Read"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function CostCacheWriteHeader() {
  const [min, setMin] = useQueryState('costCacheWriteMin', parseAsFloat)
  const [max, setMax] = useQueryState('costCacheWriteMax', parseAsFloat)
  const { sorted, toggleSort } = useColumnSort('costCacheWrite')

  return (
    <FilterHeader
      label="Cache Write"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function CostOver200kInputHeader() {
  const [min, setMin] = useQueryState('costOver200kInputMin', parseAsFloat)
  const [max, setMax] = useQueryState('costOver200kInputMax', parseAsFloat)
  const { sorted, toggleSort } = useColumnSort('costOver200kInput')

  return (
    <FilterHeader
      label=">200k Input"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function CostOver200kOutputHeader() {
  const [min, setMin] = useQueryState('costOver200kOutputMin', parseAsFloat)
  const [max, setMax] = useQueryState('costOver200kOutputMax', parseAsFloat)
  const { sorted, toggleSort } = useColumnSort('costOver200kOutput')

  return (
    <FilterHeader
      label=">200k Output"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function CostOver200kCacheReadHeader() {
  const [min, setMin] = useQueryState('costOver200kCacheReadMin', parseAsFloat)
  const [max, setMax] = useQueryState('costOver200kCacheReadMax', parseAsFloat)
  const { sorted, toggleSort } = useColumnSort('costOver200kCacheRead')

  return (
    <FilterHeader
      label=">200k Cache Read"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function CostOver200kCacheWriteHeader() {
  const [min, setMin] = useQueryState('costOver200kCacheWriteMin', parseAsFloat)
  const [max, setMax] = useQueryState('costOver200kCacheWriteMax', parseAsFloat)
  const { sorted, toggleSort } = useColumnSort('costOver200kCacheWrite')

  return (
    <FilterHeader
      label=">200k Cache Write"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function ContextLimitHeader() {
  const [min, setMin] = useQueryState('contextLimitMin', parseAsInteger)
  const [max, setMax] = useQueryState('contextLimitMax', parseAsInteger)
  const { sorted, toggleSort } = useColumnSort('contextLimit')

  return (
    <FilterHeader
      label="Context Limit"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function InputLimitHeader() {
  const [min, setMin] = useQueryState('inputLimitMin', parseAsInteger)
  const [max, setMax] = useQueryState('inputLimitMax', parseAsInteger)
  const { sorted, toggleSort } = useColumnSort('inputLimit')

  return (
    <FilterHeader
      label="Input Limit"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function OutputLimitHeader() {
  const [min, setMin] = useQueryState('outputLimitMin', parseAsInteger)
  const [max, setMax] = useQueryState('outputLimitMax', parseAsInteger)
  const { sorted, toggleSort } = useColumnSort('outputLimit')

  return (
    <FilterHeader
      label="Output Limit"
      active={min !== null || max !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <RangeFilterPopover
        min={min}
        max={max}
        onChange={(newMin, newMax) => {
          void setMin(newMin)
          void setMax(newMax)
        }}
      />
    </FilterHeader>
  )
}

export function KnowledgeHeader() {
  const [value, setValue] = useQueryState('knowledgeQuery', parseAsString)
  const { sorted, toggleSort } = useColumnSort('knowledge')

  return (
    <FilterHeader
      label="Knowledge"
      active={value !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <TextFilterPopover
        value={value}
        onChange={(v) => void setValue(v)}
        placeholder="Search knowledge..."
      />
    </FilterHeader>
  )
}

export function ReleaseDateHeader() {
  const [from, setFrom] = useQueryState('releaseDateFrom', parseAsString)
  const [to, setTo] = useQueryState('releaseDateTo', parseAsString)
  const { sorted, toggleSort } = useColumnSort('release_date')

  return (
    <FilterHeader
      label="Released"
      active={from !== null || to !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <DateRangeFilterPopover
        from={from}
        to={to}
        onChange={(f, t) => {
          void setFrom(f)
          void setTo(t)
        }}
      />
    </FilterHeader>
  )
}

export function LastUpdatedHeader() {
  const [from, setFrom] = useQueryState('lastUpdatedFrom', parseAsString)
  const [to, setTo] = useQueryState('lastUpdatedTo', parseAsString)
  const { sorted, toggleSort } = useColumnSort('last_updated')

  return (
    <FilterHeader
      label="Updated"
      active={from !== null || to !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <DateRangeFilterPopover
        from={from}
        to={to}
        onChange={(f, t) => {
          void setFrom(f)
          void setTo(t)
        }}
      />
    </FilterHeader>
  )
}

export function ModalitiesInputHeader() {
  const models = useContext(ModelsContext)
  const [modalities, setModalities] = useQueryState(
    'modalities',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const { sorted, toggleSort } = useColumnSort('modalitiesInput')

  const options = useMemo(() => {
    const set = new Set<string>()
    for (const m of models) {
      for (const mod of m.modalitiesInput) set.add(mod)
      for (const mod of m.modalitiesOutput) set.add(mod)
    }
    return Array.from(set)
      .map((m) => ({ id: m, label: m }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [models])

  function toggle(id: string) {
    const exists = modalities.includes(id)
    const next = exists
      ? modalities.filter((v) => v !== id)
      : [...modalities, id]
    void setModalities(next.length > 0 ? next : null)
  }

  return (
    <FilterHeader
      label="Input"
      active={modalities.length > 0}
      sorted={sorted}
      onSort={toggleSort}
    >
      <CheckboxFilterList
        values={modalities}
        options={options}
        onToggle={toggle}
      />
    </FilterHeader>
  )
}

export function ModalitiesOutputHeader() {
  const models = useContext(ModelsContext)
  const [modalities, setModalities] = useQueryState(
    'modalities',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const { sorted, toggleSort } = useColumnSort('modalitiesOutput')

  const options = useMemo(() => {
    const set = new Set<string>()
    for (const m of models) {
      for (const mod of m.modalitiesInput) set.add(mod)
      for (const mod of m.modalitiesOutput) set.add(mod)
    }
    return Array.from(set)
      .map((m) => ({ id: m, label: m }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [models])

  function toggle(id: string) {
    const exists = modalities.includes(id)
    const next = exists
      ? modalities.filter((v) => v !== id)
      : [...modalities, id]
    void setModalities(next.length > 0 ? next : null)
  }

  return (
    <FilterHeader
      label="Output"
      active={modalities.length > 0}
      sorted={sorted}
      onSort={toggleSort}
    >
      <CheckboxFilterList
        values={modalities}
        options={options}
        onToggle={toggle}
      />
    </FilterHeader>
  )
}

export function OpenWeightsHeader() {
  const [value, setValue] = useQueryState('openWeights', parseAsBoolean)
  const { sorted, toggleSort } = useColumnSort('open_weights')

  return (
    <FilterHeader
      label="Open"
      active={value !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <BooleanFilterPopover value={value} onChange={(v) => void setValue(v)} />
    </FilterHeader>
  )
}

export function ReasoningHeader() {
  const [value, setValue] = useQueryState('reasoning', parseAsBoolean)
  const { sorted, toggleSort } = useColumnSort('reasoning')

  return (
    <FilterHeader
      label="Reason"
      active={value !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <BooleanFilterPopover value={value} onChange={(v) => void setValue(v)} />
    </FilterHeader>
  )
}

export function ToolCallHeader() {
  const [value, setValue] = useQueryState('toolCall', parseAsBoolean)
  const { sorted, toggleSort } = useColumnSort('tool_call')

  return (
    <FilterHeader
      label="Tools"
      active={value !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <BooleanFilterPopover value={value} onChange={(v) => void setValue(v)} />
    </FilterHeader>
  )
}

export function AttachmentHeader() {
  const [value, setValue] = useQueryState('attachment', parseAsBoolean)
  const { sorted, toggleSort } = useColumnSort('attachment')

  return (
    <FilterHeader
      label="Attachment"
      active={value !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <BooleanFilterPopover value={value} onChange={(v) => void setValue(v)} />
    </FilterHeader>
  )
}

export function StructuredOutputHeader() {
  const [value, setValue] = useQueryState('structuredOutput', parseAsBoolean)
  const { sorted, toggleSort } = useColumnSort('structuredOutput')

  return (
    <FilterHeader
      label="Structured"
      active={value !== null}
      sorted={sorted}
      onSort={toggleSort}
    >
      <BooleanFilterPopover value={value} onChange={(v) => void setValue(v)} />
    </FilterHeader>
  )
}
