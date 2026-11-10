import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ArrowDown01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'nuqs'
import { useMemo, useState } from 'react'

export interface FilterOption {
  id: string
  label: string
  count?: number
}

export function FilterRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-2">
      <span className="text-muted-foreground truncate text-[11px]">
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </section>
  )
}

function CheckboxFilterList({
  label,
  values,
  options,
  onToggle,
}: {
  label: string
  values: string[]
  options: FilterOption[]
  onToggle: (id: string) => void
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const normalized = query.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalized)
    )
  }, [options, query])

  const showSearch = options.length > 8
  const ordered = [
    ...filtered.filter((option) => values.includes(option.id)),
    ...filtered.filter((option) => !values.includes(option.id)),
  ]
  const visible = showSearch ? ordered.slice(0, 8) : ordered

  return (
    <div className="bg-background overflow-hidden rounded-md border">
      {showSearch && (
        <div className="border-b p-1.5">
          <Input
            type="text"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-7 text-xs"
          />
        </div>
      )}
      <div className="w-full space-y-0.5 p-1.5">
        {visible.map((option) => (
          <label
            key={option.id}
            className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm"
          >
            <Checkbox
              checked={values.includes(option.id)}
              onCheckedChange={() => onToggle(option.id)}
            />
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {option.count !== undefined && (
              <span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
                {option.count}
              </span>
            )}
          </label>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground px-2 py-4 text-center text-xs">
            No results
          </p>
        )}
        {filtered.length > visible.length && (
          <p className="text-muted-foreground px-2 py-2 text-center text-[10px]">
            {filtered.length - visible.length} more — search to narrow
          </p>
        )}
      </div>
    </div>
  )
}

export function MultiSelectFilter({
  label,
  param,
  options,
  emptyLabel = 'Any',
}: {
  label: string
  param: string
  options: FilterOption[]
  emptyLabel?: string
}) {
  const [values, setValues] = useQueryState(
    param,
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [open, setOpen] = useState(false)

  const selectedLabel = (() => {
    if (values.length === 0) return emptyLabel
    if (values.length === 1) {
      return (
        options.find((option) => option.id === values[0])?.label ?? values[0]
      )
    }
    return `${values.length} selected`
  })()

  function toggle(id: string) {
    const next = values.includes(id)
      ? values.filter((value) => value !== id)
      : [...values, id]
    void setValues(next.length > 0 ? next : null)
  }

  return (
    <div>
      <FilterRow label={label}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'h-7 w-full justify-between font-normal',
            values.length > 0 && 'border-primary/40'
          )}
          disabled={options.length === 0}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span
            className={cn(
              'truncate',
              values.length === 0 && 'text-muted-foreground'
            )}
          >
            {selectedLabel}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(
              'text-muted-foreground size-3 shrink-0 transition-transform',
              open && 'rotate-180'
            )}
          />
        </Button>
      </FilterRow>

      {open && (
        <div className="pt-1.5">
          <CheckboxFilterList
            label={label}
            values={values}
            options={options}
            onToggle={toggle}
          />
        </div>
      )}
    </div>
  )
}

export function BooleanFilter({
  label,
  param,
  trueLabel = 'Yes',
  falseLabel = 'No',
}: {
  label: string
  param: string
  trueLabel?: string
  falseLabel?: string
}) {
  const [rawValue, setValue] = useQueryState(param, parseAsBoolean)
  const value = rawValue ?? null

  const options: { value: boolean | null; label: string }[] = [
    { value: null, label: 'Any' },
    { value: true, label: trueLabel },
    { value: false, label: falseLabel },
  ]

  return (
    <FilterRow label={label}>
      <div className="flex gap-1">
        {options.map((option) => {
          const active = value === option.value
          return (
            <Button
              key={String(option.value)}
              variant={active ? 'default' : 'outline'}
              size="sm"
              className="h-7 flex-1 px-1 text-[11px]"
              onClick={() => void setValue(option.value)}
            >
              {option.label}
            </Button>
          )
        })}
      </div>
    </FilterRow>
  )
}

export function NumberRangeFilter({
  label,
  minParam,
  maxParam,
  integer = false,
}: {
  label: string
  minParam: string
  maxParam: string
  integer?: boolean
}) {
  const parser = integer ? parseAsInteger : parseAsFloat
  const [min, setMin] = useQueryState(minParam, parser)
  const [max, setMax] = useQueryState(maxParam, parser)

  return (
    <FilterRow label={label}>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          placeholder="Min"
          min={0}
          step={integer ? 1 : 'any'}
          value={min ?? ''}
          onChange={(event) => {
            const value = event.target.value
            if (value === '') {
              void setMin(null)
              return
            }
            const number = Number(value)
            if (!Number.isNaN(number)) void setMin(number)
          }}
          className="h-7 px-1.5 text-xs"
        />
        <span className="text-muted-foreground text-[10px]">-</span>
        <Input
          type="number"
          placeholder="Max"
          min={0}
          step={integer ? 1 : 'any'}
          value={max ?? ''}
          onChange={(event) => {
            const value = event.target.value
            if (value === '') {
              void setMax(null)
              return
            }
            const number = Number(value)
            if (!Number.isNaN(number)) void setMax(number)
          }}
          className="h-7 px-1.5 text-xs"
        />
        {(min !== null || max !== null) && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground shrink-0"
            onClick={() => {
              void setMin(null)
              void setMax(null)
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
          </Button>
        )}
      </div>
    </FilterRow>
  )
}

export function DateRangeFilter({
  label,
  fromParam,
  toParam,
}: {
  label: string
  fromParam: string
  toParam: string
}) {
  const [from, setFrom] = useQueryState(fromParam, parseAsString)
  const [to, setTo] = useQueryState(toParam, parseAsString)

  return (
    <FilterRow label={label}>
      <div className="flex items-center gap-1">
        <Input
          type="date"
          value={from ?? ''}
          onChange={(event) => void setFrom(event.target.value || null)}
          className="h-7 px-1.5 text-xs"
        />
        <span className="text-muted-foreground text-[10px]">-</span>
        <Input
          type="date"
          value={to ?? ''}
          onChange={(event) => void setTo(event.target.value || null)}
          className="h-7 px-1.5 text-xs"
        />
        {(from !== null || to !== null) && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground shrink-0"
            onClick={() => {
              void setFrom(null)
              void setTo(null)
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
          </Button>
        )}
      </div>
    </FilterRow>
  )
}

export function TextFilter({
  label,
  param,
  placeholder,
}: {
  label: string
  param: string
  placeholder?: string
}) {
  const [value, setValue] = useQueryState(param, parseAsString)

  return (
    <FilterRow label={label}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder || 'Search...'}
          value={value ?? ''}
          onChange={(event) => {
            const next = event.target.value
            void setValue(next.trim() ? next : null)
          }}
          className="h-7 pr-6 text-xs"
        />
        {value !== null && (
          <button
            onClick={() => void setValue(null)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 flex size-4 -translate-y-1/2 items-center justify-center rounded"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
          </button>
        )}
      </div>
    </FilterRow>
  )
}
